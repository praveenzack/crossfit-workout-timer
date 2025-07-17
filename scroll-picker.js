class ScrollPicker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.selectedIndex = 0;
        this.values = [];
        this.isDragging = false;
        this.startY = 0;
        this.currentTransform = 0;
        this.itemHeight = 36;
        this.visibleItems = 5;
        this.maxTransform = 0;
        this.minTransform = 0;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('ScrollPicker container not found');
            return;
        }
        
        this.optionsContainer = this.container.querySelector('.picker-options');
        if (!this.optionsContainer) {
            console.error('Picker options container not found');
            return;
        }
        
        this.generateOptions();
        this.setupEventListeners();
        this.updateSelection();
    }
    
    generateOptions() {
        const type = this.optionsContainer.dataset.type;
        
        switch (type) {
            case 'minutes':
                this.values = Array.from({ length: 61 }, (_, i) => i); // 0-60 minutes
                break;
            case 'seconds':
                this.values = Array.from({ length: 60 }, (_, i) => i); // 0-59 seconds
                break;
            case 'rounds':
                this.values = Array.from({ length: 50 }, (_, i) => i + 1); // 1-50 rounds
                break;
            case 'prep-seconds':
                this.values = Array.from({ length: 61 }, (_, i) => i); // 0-60 seconds
                break;
            default:
                this.values = Array.from({ length: 10 }, (_, i) => i);
        }
        
        this.optionsContainer.innerHTML = '';
        this.values.forEach((value, index) => {
            const option = document.createElement('div');
            option.className = 'picker-option';
            option.textContent = this.formatValue(value, type);
            option.dataset.index = index;
            option.dataset.value = value;
            this.optionsContainer.appendChild(option);
        });
        
        this.maxTransform = 0;
        this.minTransform = -(this.values.length - 1) * this.itemHeight;
    }
    
    formatValue(value, type) {
        switch (type) {
            case 'minutes':
                return value.toString().padStart(2, '0');
            case 'seconds':
                return value.toString().padStart(2, '0');
            case 'rounds':
                return value.toString();
            case 'prep-seconds':
                return value.toString().padStart(2, '0');
            default:
                return value.toString();
        }
    }
    
    setupEventListeners() {
        // Touch and mouse events
        this.container.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        this.container.addEventListener('mousedown', this.handleStart.bind(this), { passive: false });
        
        document.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        document.addEventListener('mousemove', this.handleMove.bind(this), { passive: false });
        
        document.addEventListener('touchend', this.handleEnd.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));
        
        // Click events for options
        this.optionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('picker-option')) {
                const index = parseInt(e.target.dataset.index);
                this.selectIndex(index);
            }
        });
        
        // Wheel events
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            const newIndex = Math.max(0, Math.min(this.values.length - 1, this.selectedIndex + delta));
            this.selectIndex(newIndex);
        });
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        this.container.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaY = currentY - this.startY;
        
        let newTransform = this.currentTransform + deltaY;
        newTransform = Math.max(this.minTransform, Math.min(this.maxTransform, newTransform));
        
        this.optionsContainer.style.transform = `translateY(${newTransform}px)`;
        this.updateVisualSelection(newTransform);
        
        e.preventDefault();
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        
        // Snap to nearest item
        const newIndex = Math.round(-this.currentTransform / this.itemHeight);
        this.selectIndex(Math.max(0, Math.min(this.values.length - 1, newIndex)));
    }
    
    selectIndex(index) {
        this.selectedIndex = index;
        this.currentTransform = -index * this.itemHeight;
        
        this.optionsContainer.style.transform = `translateY(${this.currentTransform}px)`;
        this.updateSelection();
        
        // Trigger change event
        this.container.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.values[index],
                index: index,
                formattedValue: this.formatValue(this.values[index], this.optionsContainer.dataset.type)
            }
        }));
    }
    
    updateVisualSelection(transform = this.currentTransform) {
        const centerIndex = Math.round(-transform / this.itemHeight);
        const options = this.optionsContainer.querySelectorAll('.picker-option');
        
        options.forEach((option, index) => {
            option.classList.remove('selected', 'adjacent', 'distant', 'very-distant');
            
            const distance = Math.abs(index - centerIndex);
            
            if (distance === 0) {
                option.classList.add('selected');
            } else if (distance === 1) {
                option.classList.add('adjacent');
            } else if (distance === 2) {
                option.classList.add('distant');
            } else {
                option.classList.add('very-distant');
            }
        });
    }
    
    updateSelection() {
        this.updateVisualSelection();
    }
    
    getValue() {
        return this.values[this.selectedIndex];
    }
    
    setValue(value) {
        const index = this.values.indexOf(value);
        if (index !== -1) {
            this.selectIndex(index);
        }
    }
    
    setValues(values) {
        this.values = values;
        this.generateOptions();
        this.selectedIndex = 0;
        this.currentTransform = 0;
        this.updateSelection();
    }
}

// Time picker utility functions
class TimePicker {
    constructor(minutesId, secondsId, initialMinutes = 0, initialSeconds = 20) {
        this.minutesPicker = new ScrollPicker(minutesId);
        this.secondsPicker = new ScrollPicker(secondsId);
        
        this.minutesPicker.setValue(initialMinutes);
        this.secondsPicker.setValue(initialSeconds);
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.minutesPicker.container.addEventListener('change', () => {
            this.onTimeChange();
        });
        
        this.secondsPicker.container.addEventListener('change', () => {
            this.onTimeChange();
        });
    }
    
    onTimeChange() {
        const minutes = this.minutesPicker.getValue();
        const seconds = this.secondsPicker.getValue();
        const totalSeconds = minutes * 60 + seconds;
        
        // Dispatch custom event with total seconds
        document.dispatchEvent(new CustomEvent('timePickerChange', {
            detail: {
                minutes,
                seconds,
                totalSeconds,
                picker: this
            }
        }));
    }
    
    setTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        this.minutesPicker.setValue(minutes);
        this.secondsPicker.setValue(seconds);
    }
    
    getTime() {
        return this.minutesPicker.getValue() * 60 + this.secondsPicker.getValue();
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollPicker, TimePicker };
}