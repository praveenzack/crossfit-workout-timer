# TuffTimer Workout Timer

A comprehensive workout timer application built with vanilla JavaScript, HTML, and CSS. Features voice announcements, customizable timers, and a focus on reliability under intense usage conditions.

## Features

### Timer Types
- **AMRAP** (As Many Rounds As Possible) - Set time limit, track rounds
- **EMOM** (Every Minute On the Minute) - Repeat exercise every minute
- **Tabata** - 20 seconds work, 10 seconds rest intervals
- **Custom Intervals** - Adjustable work/rest periods
- **Countdown Timer** - Single exercise time cap

### User Interface
- Minimalist, high-contrast design
- Large, easily readable numbers (visible from 10+ feet)
- Touch-friendly buttons (60px minimum size)
- Color-coded timer states (prep, work, rest, finished)
- Responsive design for mobile and desktop

### Audio Features
- Clear voice announcements for:
  - Start/stop of intervals
  - Halfway points
  - Final countdown (last 5 seconds)
  - Exercise transitions
- Customizable voice gender and language
- Background music integration with auto-volume adjustment

### Customization Options
- Save favorite workout configurations
- Create custom interval patterns
- Adjust voice announcement frequency
- Modify warning times (default: 5 seconds)
- Set preparation countdown duration

### Additional Features
- Screen stay-awake function during workouts
- Background audio support
- Quick-start presets for common CrossFit workouts
- Workout history tracking and export
- Progressive Web App (PWA) support
- Offline functionality

## Quick Start Presets

### Hero WODs
- **Cindy** - 20 min AMRAP: 5 pull-ups, 10 push-ups, 15 squats
- **Fran** - 21-15-9 thrusters and pull-ups
- **Murph** - 1 mile run, 100 pull-ups, 200 push-ups, 300 squats, 1 mile run

### Tabata Workouts
- **Tabata Burpees** - 8 rounds of 20s work, 10s rest
- **Tabata Squats** - 8 rounds of 20s work, 10s rest

### AMRAP Workouts
- **AMRAP 10 CrossFit** - 10 burpees, 15 KB swings, 20 box jumps
- **AMRAP 15 Bodyweight** - 5 pull-ups, 10 push-ups, 15 squats, 20 sit-ups

### EMOM Workouts
- **EMOM 12 Burpees** - 12 burpees every minute for 12 minutes

## Installation

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Select Timer Type**: Choose from AMRAP, EMOM, Tabata, Custom, or Countdown
2. **Configure Settings**: Set work time, rest time, rounds, and prep time
3. **Start Timer**: Begin your workout with voice announcements
4. **Control Timer**: Use play/pause, reset, and stop controls
5. **Track History**: View and export your workout history

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Technical Features

- **Wake Lock API** - Prevents screen from sleeping during workouts
- **Web Speech API** - Voice announcements with customizable voices
- **Service Worker** - Offline functionality and background notifications
- **Local Storage** - Persistent settings and workout history
- **Progressive Web App** - Installable on mobile devices

## File Structure

```
WODTimer/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Main application logic
├── presets.js          # CrossFit workout presets
├── sw.js              # Service worker for PWA
├── manifest.json      # Web app manifest
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Customization

### Adding New Presets
Edit `presets.js` to add new workout configurations:

```javascript
my_custom_workout: {
    name: "My Custom Workout",
    type: "amrap",
    workTime: 600,
    restTime: 0,
    rounds: 1,
    prepTime: 10,
    description: "Custom workout description",
    difficulty: "intermediate"
}
```

### Modifying Voice Announcements
Adjust voice settings in the Settings panel or modify the `speak()` method in `script.js` for custom announcements.

## Performance Considerations

- Optimized for sweaty hands with large touch targets
- Efficient timer implementation using `setInterval`
- Minimal DOM manipulation for smooth performance
- Responsive design with CSS Grid and Flexbox

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues or feature requests, please create an issue in the repository.