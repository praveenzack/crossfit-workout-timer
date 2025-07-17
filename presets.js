const CROSSFIT_PRESETS = {
    // Hero WODs
    murph: {
        name: "Murph",
        type: "countdown",
        workTime: 3600,
        restTime: 0,
        rounds: 1,
        prepTime: 15,
        description: "1 mile run, 100 pull-ups, 200 push-ups, 300 squats, 1 mile run",
        difficulty: "advanced",
        timeCapMinutes: 60
    },
    
    fran: {
        name: "Fran",
        type: "countdown",
        workTime: 600,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "21-15-9 thrusters (95/65) and pull-ups",
        difficulty: "intermediate",
        timeCapMinutes: 10
    },
    
    cindy: {
        name: "Cindy",
        type: "amrap",
        workTime: 1200,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "5 pull-ups, 10 push-ups, 15 squats",
        difficulty: "beginner",
        timeCapMinutes: 20
    },
    
    grace: {
        name: "Grace",
        type: "countdown",
        workTime: 600,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "30 clean and jerks for time (135/95)",
        difficulty: "intermediate",
        timeCapMinutes: 10
    },
    
    helen: {
        name: "Helen",
        type: "countdown",
        workTime: 1200,
        restTime: 0,
        rounds: 1,
        prepTime: 15,
        description: "3 rounds: 400m run, 21 KB swings (53/35), 12 pull-ups",
        difficulty: "intermediate",
        timeCapMinutes: 20
    },
    
    annie: {
        name: "Annie",
        type: "countdown",
        workTime: 900,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "50-40-30-20-10 double unders and sit-ups",
        difficulty: "intermediate",
        timeCapMinutes: 15
    },
    
    // Common Training WODs
    fight_gone_bad: {
        name: "Fight Gone Bad",
        type: "custom",
        workTime: 60,
        restTime: 60,
        rounds: 5,
        prepTime: 10,
        description: "3 rounds: Wall balls, Sumo deadlift high pull, Box jumps, Push press, Row",
        difficulty: "advanced",
        timeCapMinutes: 17
    },
    
    karen: {
        name: "Karen",
        type: "countdown",
        workTime: 900,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "150 wall balls for time (20/14)",
        difficulty: "intermediate",
        timeCapMinutes: 15
    },
    
    jackie: {
        name: "Jackie",
        type: "countdown",
        workTime: 900,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "1000m row, 50 thrusters (45/35), 30 pull-ups",
        difficulty: "intermediate",
        timeCapMinutes: 15
    },
    
    barbara: {
        name: "Barbara",
        type: "custom",
        workTime: 900,
        restTime: 180,
        rounds: 5,
        prepTime: 15,
        description: "20 pull-ups, 30 push-ups, 40 sit-ups, 50 squats",
        difficulty: "advanced",
        timeCapMinutes: 30
    },
    
    // EMOM Workouts
    emom_12_burpees: {
        name: "EMOM 12 Burpees",
        type: "emom",
        workTime: 60,
        restTime: 0,
        rounds: 12,
        prepTime: 10,
        description: "Every minute: 12 burpees",
        difficulty: "intermediate",
        timeCapMinutes: 12
    },
    
    emom_15_thrusters: {
        name: "EMOM 15 Thrusters",
        type: "emom",
        workTime: 60,
        restTime: 0,
        rounds: 15,
        prepTime: 10,
        description: "Every minute: 15 thrusters (65/45)",
        difficulty: "intermediate",
        timeCapMinutes: 15
    },
    
    // Tabata Workouts
    tabata_burpees: {
        name: "Tabata Burpees",
        type: "tabata",
        workTime: 20,
        restTime: 10,
        rounds: 8,
        prepTime: 10,
        description: "8 rounds: 20s burpees, 10s rest",
        difficulty: "intermediate",
        timeCapMinutes: 4
    },
    
    tabata_squats: {
        name: "Tabata Squats",
        type: "tabata",
        workTime: 20,
        restTime: 10,
        rounds: 8,
        prepTime: 10,
        description: "8 rounds: 20s air squats, 10s rest",
        difficulty: "beginner",
        timeCapMinutes: 4
    },
    
    // AMRAP Workouts
    amrap_10_crossfit: {
        name: "AMRAP 10 CrossFit",
        type: "amrap",
        workTime: 600,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "10 burpees, 15 KB swings, 20 box jumps",
        difficulty: "intermediate",
        timeCapMinutes: 10
    },
    
    amrap_15_bodyweight: {
        name: "AMRAP 15 Bodyweight",
        type: "amrap",
        workTime: 900,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "5 pull-ups, 10 push-ups, 15 squats, 20 sit-ups",
        difficulty: "beginner",
        timeCapMinutes: 15
    },
    
    amrap_20_endurance: {
        name: "AMRAP 20 Endurance",
        type: "amrap",
        workTime: 1200,
        restTime: 0,
        rounds: 1,
        prepTime: 10,
        description: "400m run, 15 KB swings, 15 burpees",
        difficulty: "intermediate",
        timeCapMinutes: 20
    },
    
    // Custom Intervals
    death_by_burpees: {
        name: "Death by Burpees",
        type: "custom",
        workTime: 60,
        restTime: 0,
        rounds: 20,
        prepTime: 10,
        description: "Min 1: 1 burpee, Min 2: 2 burpees, etc.",
        difficulty: "advanced",
        timeCapMinutes: 20
    },
    
    // Strength Intervals
    strength_intervals: {
        name: "Strength Intervals",
        type: "custom",
        workTime: 90,
        restTime: 90,
        rounds: 5,
        prepTime: 15,
        description: "90s work, 90s rest - strength focus",
        difficulty: "intermediate",
        timeCapMinutes: 15
    },
    
    // Recovery/Mobility
    mobility_flow: {
        name: "Mobility Flow",
        type: "custom",
        workTime: 45,
        restTime: 15,
        rounds: 10,
        prepTime: 5,
        description: "45s mobility work, 15s transition",
        difficulty: "beginner",
        timeCapMinutes: 10
    }
};

// Function to get presets by difficulty
function getPresetsByDifficulty(difficulty) {
    return Object.entries(CROSSFIT_PRESETS)
        .filter(([key, preset]) => preset.difficulty === difficulty)
        .map(([key, preset]) => ({ key, ...preset }));
}

// Function to get presets by type
function getPresetsByType(type) {
    return Object.entries(CROSSFIT_PRESETS)
        .filter(([key, preset]) => preset.type === type)
        .map(([key, preset]) => ({ key, ...preset }));
}

// Function to get hero WODs
function getHeroWODs() {
    const heroWODs = ['murph', 'fran', 'cindy', 'grace', 'helen', 'annie', 'fight_gone_bad', 'karen', 'jackie', 'barbara'];
    return heroWODs.map(key => ({ key, ...CROSSFIT_PRESETS[key] }));
}

// Function to get quick start presets (most popular)
function getQuickStartPresets() {
    const quickStart = ['cindy', 'fran', 'murph', 'tabata_burpees', 'amrap_10_crossfit', 'emom_12_burpees'];
    return quickStart.map(key => ({ key, ...CROSSFIT_PRESETS[key] }));
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CROSSFIT_PRESETS,
        getPresetsByDifficulty,
        getPresetsByType,
        getHeroWODs,
        getQuickStartPresets
    };
}