class CrossFitTimer {
    constructor() {
        this.currentScreen = 'selection';
        this.timerType = null;
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.currentRound = 1;
        this.totalRounds = 1;
        this.workTime = 20;
        this.restTime = 10;
        this.prepTime = 10;
        this.currentPhase = 'prep';
        this.intervalId = null;
        this.audioContext = null;
        this.settings = this.loadSettings();
        this.history = this.loadHistory();
        this.favorites = this.loadFavorites();
        this.wakeLock = null;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeAudio();
        this.requestWakeLock();
        this.populatePresets();
        this.initializeScrollPickers();
    }

    initializeElements() {
        this.timerSelectionEl = document.getElementById('timerSelection');
        this.timerConfigEl = document.getElementById('timerConfig');
        this.timerDisplayEl = document.getElementById('timerDisplay');
        this.settingsPanelEl = document.getElementById('settingsPanel');
        this.historyPanelEl = document.getElementById('historyPanel');
        
        this.timeDisplayEl = document.getElementById('timeDisplay');
        this.timerLabelEl = document.getElementById('timerLabel');
        this.statusIndicatorEl = document.getElementById('statusIndicator');
        this.roundCounterEl = document.getElementById('roundCounter');
        this.progressFillEl = document.getElementById('progressFill');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        
        this.configTitleEl = document.getElementById('configTitle');
        this.workTimeInput = document.getElementById('workTime');
        this.restTimeInput = document.getElementById('restTime');
        this.roundsInput = document.getElementById('rounds');
        this.prepTimeInput = document.getElementById('prepTime');
        this.progressCircle = document.getElementById('progressCircle');
        this.progressBar = document.getElementById('progressBar');
        
        // Initialize scroll pickers
        this.workTimePicker = null;
        this.restTimePicker = null;
        this.roundsPicker = null;
        this.prepTimePicker = null;
    }

    bindEvents() {
        this.bindTimerButtons();
        this.bindPresetButtons();

        document.getElementById('backBtn').addEventListener('click', () => this.showScreen('selection'));
        document.getElementById('startTimerBtn').addEventListener('click', () => this.startTimer());
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTimer());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopTimer());
        document.getElementById('backToSelectionBtn').addEventListener('click', () => this.backToSelection());
        
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.hideSettings());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistory());
        document.getElementById('closeHistoryBtn').addEventListener('click', () => this.hideHistory());
        document.getElementById('exportHistoryBtn').addEventListener('click', () => this.exportHistory());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        
        document.getElementById('favoritesBtn').addEventListener('click', () => this.showFavorites());
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                this.handleBackgroundMode();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.currentScreen === 'timer') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });
    }

    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.speechSynthesis = window.speechSynthesis;
            this.voices = [];
            
            this.speechSynthesis.onvoiceschanged = () => {
                this.voices = this.speechSynthesis.getVoices();
            };
            
            if (this.voices.length === 0) {
                this.voices = this.speechSynthesis.getVoices();
            }
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    async requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('Screen wake lock acquired');
            }
        } catch (error) {
            console.warn('Wake lock request failed:', error);
        }
    }

    selectTimerType(type) {
        this.timerType = type;
        this.configureTimer(type);
        this.showScreen('config');
    }

    selectPreset(preset) {
        const config = CROSSFIT_PRESETS[preset];
        if (config) {
            this.timerType = config.type;
            this.workTime = config.workTime;
            this.restTime = config.restTime;
            this.totalRounds = config.rounds;
            this.prepTime = config.prepTime;
            this.startTimer();
        }
    }

    configureTimer(type) {
        if (!this.configTitleEl) {
            console.error('Config title element not found');
            return;
        }
        
        this.configTitleEl.textContent = `Configure ${type.toUpperCase()}`;
        
        // Configure picker values based on timer type
        switch (type) {
            case 'amrap':
                this.workTimePicker.setTime(1200); // 20 minutes
                this.restTimePicker.setTime(0);
                this.roundsPicker.setValue(1);
                break;
            case 'emom':
                this.workTimePicker.setTime(60); // 1 minute
                this.restTimePicker.setTime(0);
                this.roundsPicker.setValue(10);
                break;
            case 'tabata':
                this.workTimePicker.setTime(20); // 20 seconds
                this.restTimePicker.setTime(10); // 10 seconds
                this.roundsPicker.setValue(8);
                break;
            case 'custom':
                this.workTimePicker.setTime(45); // 45 seconds
                this.restTimePicker.setTime(15); // 15 seconds
                this.roundsPicker.setValue(5);
                break;
            case 'countdown':
                this.workTimePicker.setTime(300); // 5 minutes
                this.restTimePicker.setTime(0);
                this.roundsPicker.setValue(1);
                break;
        }
        
        // Show/hide picker groups based on timer type
        const workTimeGroup = document.getElementById('workTimeGroup');
        const restTimeGroup = document.getElementById('restTimeGroup');
        const roundsGroup = document.getElementById('roundsGroup');
        const prepTimeGroup = document.getElementById('prepTimeGroup');
        
        // Show all groups first
        if (workTimeGroup) workTimeGroup.style.display = 'flex';
        if (restTimeGroup) restTimeGroup.style.display = 'flex';
        if (roundsGroup) roundsGroup.style.display = 'flex';
        if (prepTimeGroup) prepTimeGroup.style.display = 'flex';
        
        // Hide specific groups based on timer type
        if (type === 'amrap' || type === 'countdown') {
            if (restTimeGroup) restTimeGroup.style.display = 'none';
            if (roundsGroup) roundsGroup.style.display = 'none';
        }
        if (type === 'emom') {
            if (restTimeGroup) restTimeGroup.style.display = 'none';
        }
        
        // Update current values
        this.workTime = this.workTimePicker.getTime();
        this.restTime = this.restTimePicker.getTime();
        this.totalRounds = this.roundsPicker.getValue();
        this.prepTime = this.prepTimePicker.getValue();
    }

    startTimer() {
        this.workTime = this.workTimePicker.getTime();
        this.restTime = this.restTimePicker.getTime();
        this.totalRounds = this.roundsPicker.getValue();
        this.prepTime = this.prepTimePicker.getValue();
        
        this.currentTime = this.prepTime;
        this.currentRound = 1;
        this.currentPhase = 'prep';
        this.isRunning = true;
        this.isPaused = false;
        
        // Initialize play/pause button
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        
        this.showScreen('timer');
        this.updateDisplay();
        this.startInterval();
        this.speak('Get ready!');
        
        this.saveToHistory();
    }

    startInterval() {
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.tick();
            }
        }, 1000);
    }

    tick() {
        if (this.currentTime > 0) {
            this.currentTime--;
            this.updateDisplay();
            this.checkAnnouncements();
        } else {
            this.nextPhase();
        }
    }

    nextPhase() {
        switch (this.timerType) {
            case 'amrap':
                this.handleAmrapPhase();
                break;
            case 'emom':
                this.handleEmomPhase();
                break;
            case 'tabata':
            case 'custom':
                this.handleIntervalPhase();
                break;
            case 'countdown':
                this.handleCountdownPhase();
                break;
        }
    }

    handleAmrapPhase() {
        if (this.currentPhase === 'prep') {
            this.currentPhase = 'work';
            this.currentTime = this.workTime;
            this.speak('Start!');
        } else {
            this.finishWorkout();
        }
    }

    handleEmomPhase() {
        if (this.currentPhase === 'prep') {
            this.currentPhase = 'work';
            this.currentTime = this.workTime;
            this.speak('Start!');
        } else if (this.currentPhase === 'work') {
            if (this.currentRound < this.totalRounds) {
                this.currentRound++;
                this.currentTime = this.workTime;
                this.speak(`Round ${this.currentRound}`);
            } else {
                this.finishWorkout();
            }
        }
    }

    handleIntervalPhase() {
        if (this.currentPhase === 'prep') {
            this.currentPhase = 'work';
            this.currentTime = this.workTime;
            this.speak('Work!');
        } else if (this.currentPhase === 'work') {
            if (this.restTime > 0) {
                this.currentPhase = 'rest';
                this.currentTime = this.restTime;
                this.speak('Rest!');
            } else {
                this.nextRound();
            }
        } else if (this.currentPhase === 'rest') {
            this.nextRound();
        }
    }

    handleCountdownPhase() {
        if (this.currentPhase === 'prep') {
            this.currentPhase = 'work';
            this.currentTime = this.workTime;
            this.speak('Start!');
        } else {
            this.finishWorkout();
        }
    }

    nextRound() {
        if (this.currentRound < this.totalRounds) {
            this.currentRound++;
            this.currentPhase = 'work';
            this.currentTime = this.workTime;
            this.speak(`Round ${this.currentRound} - Work!`);
        } else {
            this.finishWorkout();
        }
    }

    finishWorkout() {
        this.isRunning = false;
        this.currentPhase = 'finished';
        this.currentTime = 0;
        this.speak('Workout complete! Great job!');
        this.updateDisplay();
        this.playFinishSound();
        clearInterval(this.intervalId);
    }

    togglePlayPause() {
        if (this.isRunning) {
            this.isPaused = !this.isPaused;
            
            // Update SVG icons
            const playIcon = document.getElementById('playIcon');
            const pauseIcon = document.getElementById('pauseIcon');
            
            if (this.isPaused) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                this.speak('Paused');
            } else {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                this.speak('Resume');
            }
            
            this.playPauseBtn.classList.toggle('playing', !this.isPaused);
            this.playPauseBtn.classList.toggle('paused', this.isPaused);
        }
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = this.prepTime;
        this.currentRound = 1;
        this.currentPhase = 'prep';
        
        // Reset play/pause button
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        
        this.playPauseBtn.classList.remove('playing', 'paused');
        this.updateDisplay();
        clearInterval(this.intervalId);
        this.speak('Timer reset');
    }

    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.intervalId);
        this.showScreen('selection');
        this.speak('Timer stopped');
    }

    backToSelection() {
        if (this.isRunning && !confirm('Are you sure you want to stop the timer and go back?')) {
            return;
        }
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.intervalId);
        this.showScreen('selection');
        this.speak('Returning to main menu');
    }

    updateDisplay() {
        this.timeDisplayEl.textContent = this.formatTime(this.currentTime);
        this.timerLabelEl.textContent = this.getPhaseLabel();
        this.statusIndicatorEl.textContent = this.currentPhase.toUpperCase();
        this.statusIndicatorEl.className = `status-indicator ${this.currentPhase}`;
        
        if (this.timerType !== 'amrap' && this.timerType !== 'countdown') {
            this.roundCounterEl.textContent = `Round ${this.currentRound} / ${this.totalRounds}`;
        } else {
            this.roundCounterEl.textContent = this.timerType === 'amrap' ? 'AMRAP' : 'Time Cap';
        }
        
        this.updateProgressBar();
    }

    updateProgressBar() {
        let progress = 0;
        let totalTime = 0;
        
        if (this.currentPhase === 'prep') {
            totalTime = this.prepTime;
            progress = ((this.prepTime - this.currentTime) / this.prepTime) * 100;
        } else if (this.currentPhase === 'work') {
            totalTime = this.workTime;
            progress = ((this.workTime - this.currentTime) / this.workTime) * 100;
        } else if (this.currentPhase === 'rest') {
            totalTime = this.restTime;
            progress = ((this.restTime - this.currentTime) / this.restTime) * 100;
        }
        
        // Update circular progress
        const circumference = 2 * Math.PI * 140; // radius = 140
        const offset = circumference - (progress / 100) * circumference;
        
        if (this.progressCircle) {
            this.progressCircle.style.strokeDashoffset = offset;
        }
        
        // Update animated progress bar
        if (this.progressBar) {
            this.progressBar.style.strokeDashoffset = offset;
            
            // Add blinking effect for last 10 seconds
            if (this.currentTime <= 10 && this.currentTime > 0) {
                this.progressBar.style.animation = 'progressBlink 1s ease-in-out infinite';
            } else {
                this.progressBar.style.animation = 'progressPulse 2s ease-in-out infinite';
            }
            
            // Change color based on phase
            if (this.currentPhase === 'work') {
                this.progressBar.style.stroke = 'url(#progressGradient)';
            } else if (this.currentPhase === 'rest') {
                this.progressBar.style.stroke = '#4facfe';
            } else if (this.currentPhase === 'prep') {
                this.progressBar.style.stroke = '#00ff88';
            }
        }
    }

    getPhaseLabel() {
        switch (this.currentPhase) {
            case 'prep': return 'Get Ready';
            case 'work': return this.timerType === 'amrap' ? 'Go!' : 'Work';
            case 'rest': return 'Rest';
            case 'finished': return 'Finished!';
            default: return '';
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    checkAnnouncements() {
        const warningTime = this.settings.countdownWarning || 5;
        
        if (this.currentTime <= warningTime && this.currentTime > 0) {
            this.speak(this.currentTime.toString());
        }
    }

    speak(text) {
        if (!this.settings.voiceEnabled || !this.speechSynthesis) return;
        
        this.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const voice = this.voices.find(v => 
            v.lang.startsWith(this.settings.voiceLanguage) && 
            v.name.toLowerCase().includes(this.settings.voiceGender)
        ) || this.voices.find(v => v.lang.startsWith(this.settings.voiceLanguage)) || this.voices[0];
        
        if (voice) {
            utterance.voice = voice;
        }
        
        this.speechSynthesis.speak(utterance);
    }

    playFinishSound() {
        if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        }
    }

    showScreen(screen) {
        this.currentScreen = screen;
        this.timerSelectionEl.style.display = screen === 'selection' ? 'block' : 'none';
        this.timerConfigEl.style.display = screen === 'config' ? 'block' : 'none';
        this.timerDisplayEl.style.display = screen === 'timer' ? 'block' : 'none';
    }

    showSettings() {
        this.settingsPanelEl.style.display = 'flex';
        this.loadSettingsToForm();
    }

    hideSettings() {
        this.settingsPanelEl.style.display = 'none';
    }

    loadSettingsToForm() {
        document.getElementById('voiceEnabled').checked = this.settings.voiceEnabled;
        document.getElementById('voiceGender').value = this.settings.voiceGender;
        document.getElementById('voiceLanguage').value = this.settings.voiceLanguage;
        document.getElementById('countdownWarning').value = this.settings.countdownWarning;
        document.getElementById('musicVolume').value = this.settings.musicVolume;
    }

    saveSettings() {
        this.settings = {
            voiceEnabled: document.getElementById('voiceEnabled').checked,
            voiceGender: document.getElementById('voiceGender').value,
            voiceLanguage: document.getElementById('voiceLanguage').value,
            countdownWarning: parseInt(document.getElementById('countdownWarning').value),
            musicVolume: parseInt(document.getElementById('musicVolume').value)
        };
        
        localStorage.setItem('crossfit-timer-settings', JSON.stringify(this.settings));
        this.hideSettings();
        this.speak('Settings saved');
    }

    loadSettings() {
        const defaultSettings = {
            voiceEnabled: true,
            voiceGender: 'female',
            voiceLanguage: 'en-US',
            countdownWarning: 5,
            musicVolume: 20
        };
        
        try {
            const stored = localStorage.getItem('crossfit-timer-settings');
            return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
        } catch (error) {
            return defaultSettings;
        }
    }

    showHistory() {
        this.historyPanelEl.style.display = 'flex';
        this.renderHistory();
    }

    hideHistory() {
        this.historyPanelEl.style.display = 'none';
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #666;">No workout history yet</p>';
            return;
        }
        
        this.history.slice().reverse().forEach(workout => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-item-info">
                    <div class="history-item-title">${workout.type.toUpperCase()}</div>
                    <div class="history-item-details">
                        Work: ${this.formatTime(workout.workTime)} | 
                        Rest: ${this.formatTime(workout.restTime)} | 
                        Rounds: ${workout.rounds}
                    </div>
                    <div class="history-item-date">${new Date(workout.date).toLocaleDateString()}</div>
                </div>
            `;
            historyList.appendChild(item);
        });
    }

    saveToHistory() {
        const workout = {
            type: this.timerType,
            workTime: this.workTime,
            restTime: this.restTime,
            rounds: this.totalRounds,
            date: new Date().toISOString()
        };
        
        this.history.push(workout);
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
        
        localStorage.setItem('crossfit-timer-history', JSON.stringify(this.history));
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem('crossfit-timer-history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }

    exportHistory() {
        const dataStr = JSON.stringify(this.history, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'crossfit-timer-history.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all workout history?')) {
            this.history = [];
            localStorage.removeItem('crossfit-timer-history');
            this.renderHistory();
            this.speak('History cleared');
        }
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('crossfit-timer-favorites');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }

    bindTimerButtons() {
        document.querySelectorAll('.timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Timer button clicked:', e.target.dataset.type);
                this.selectTimerType(e.target.dataset.type);
            });
        });
    }

    bindPresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Preset button clicked:', e.target.dataset.preset);
                this.selectPreset(e.target.dataset.preset);
            });
        });
    }

    populatePresets() {
        const presetButtons = document.getElementById('presetButtons');
        const quickStartPresets = getQuickStartPresets();
        
        presetButtons.innerHTML = '';
        quickStartPresets.forEach(preset => {
            const button = document.createElement('button');
            button.className = 'preset-btn';
            button.dataset.preset = preset.key;
            button.textContent = preset.name;
            button.title = `${preset.description} (${preset.difficulty})`;
            presetButtons.appendChild(button);
        });
        
        // Re-bind preset button events after populating
        this.bindPresetButtons();
    }

    initializeScrollPickers() {
        // Initialize work time picker
        this.workTimePicker = new TimePicker('workMinutes', 'workSeconds', 0, 20);
        
        // Initialize rest time picker
        this.restTimePicker = new TimePicker('restMinutes', 'restSeconds', 0, 10);
        
        // Initialize rounds picker
        this.roundsPicker = new ScrollPicker('roundsCount');
        this.roundsPicker.setValue(8);
        
        // Initialize prep time picker
        this.prepTimePicker = new ScrollPicker('prepSeconds');
        this.prepTimePicker.setValue(10);
        
        // Store references for easy access
        this.workTime = 20;
        this.restTime = 10;
        this.totalRounds = 8;
        this.prepTime = 10;
        
        // Listen for picker changes
        document.addEventListener('timePickerChange', (e) => {
            if (e.detail.picker === this.workTimePicker) {
                this.workTime = e.detail.totalSeconds;
            } else if (e.detail.picker === this.restTimePicker) {
                this.restTime = e.detail.totalSeconds;
            }
        });
        
        this.roundsPicker.container.addEventListener('change', (e) => {
            this.totalRounds = e.detail.value;
        });
        
        this.prepTimePicker.container.addEventListener('change', (e) => {
            this.prepTime = e.detail.value;
        });
    }

    updateSliderValues() {
        const workTimeValue = document.getElementById('workTimeValue');
        const restTimeValue = document.getElementById('restTimeValue');
        const roundsValue = document.getElementById('roundsValue');
        const prepTimeValue = document.getElementById('prepTimeValue');
        
        if (workTimeValue && this.workTimeInput) {
            workTimeValue.textContent = this.workTimeInput.value;
        }
        if (restTimeValue && this.restTimeInput) {
            restTimeValue.textContent = this.restTimeInput.value;
        }
        if (roundsValue && this.roundsInput) {
            roundsValue.textContent = this.roundsInput.value;
        }
        if (prepTimeValue && this.prepTimeInput) {
            prepTimeValue.textContent = this.prepTimeInput.value;
        }
    }

    showFavorites() {
        console.log('Favorites feature coming soon!');
    }

    handleBackgroundMode() {
        if (this.isRunning && !this.isPaused) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('CrossFit Timer', {
                    body: `${this.currentPhase.toUpperCase()} - ${this.formatTime(this.currentTime)}`,
                    icon: '/icon-192x192.png',
                    badge: '/icon-192x192.png',
                    silent: false,
                    tag: 'crossfit-timer'
                });
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const timer = new CrossFitTimer();
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
});