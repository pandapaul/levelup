$(function () {
	var e = $('app');
	var display = {
		xp: e.find('.progress-bar .label'),
		level: e.find('.level'),
		progress: e.find('.progress'),
		grindButton: e.find('button.grind'),
		log: e.find('.log')
	};
	var level, xp;
	var levels = [0, 100, 200, 300, 500, 750, 1000, 1300, 1600, 2000, 2500, 3000, 3500, 4000, 5000];
	var maxLevelGap = levels[levels.length - 1] - levels[levels.length - 2];
	var events = [{
		description: 'Did some gathering.',
		xpLow: 1,
		xpHigh: 5,
		chance: 0,
		class: 'standard'
	}, {
		description: 'Did some crafting.',
		xpLow: 1,
		xpHigh: 5,
		chance: 0.2,
		class: 'standard'
	}, {
		description: 'Did some fighting.',
		xpLow: 1,
		xpHigh: 5,
		chance: 0.4,
		class: 'standard'
	}, {
		description: 'Gathered some uncommon materials.',
		xpLow: 5,
		xpHigh: 15,
		chance: 0.6,
		class: 'good'
	}, {
		description: 'Crafted something neat.',
		xpLow: 5,
		xpHigh: 15,
		chance: 0.7,
		class: 'good'
	}, {
		description: 'Fought a tough mob.',
		xpLow: 5,
		xpHigh: 15,
		chance: 0.8,
		class: 'good'
	}, {
		description: 'Mined sparkling gems.',
		xpLow: 15,
		xpHigh: 30,
		chance: 0.9,
		class: 'great'
	}, {
		description: 'Built an exquisite weapon.',
		xpLow: 15,
		xpHigh: 30,
		chance: 0.93,
		class: 'great'
	}, {
		description: 'Vanquished a dragon.',
		xpLow: 15,
		xpHigh: 30,
		chance: 0.96,
		class: 'great'
	}, {
		description: 'Completed a quest!',
		xpLow: 30,
		xpHigh: 75,
		chance: 0.99,
		class: 'ultimate'
	}];

	function reset() {
		level = 1;
		xp = 0;
		display.log.empty();
		displayProgress();
	}

	reset();

	display.grindButton.on('click', grind);

	function grind() {
		var event = randomEvent();
		event.gain = randomInt(event.xpLow, event.xpHigh);
		xp += event.gain;
		calculateLevel();
		log(event);
		displayProgress();
	}

	function randomEvent() {
		var chance = Math.random();
		var event;
		$.each(events, function (i, v) {
			if (chance > v.chance) {
				event = v;
			}
		});
		return event;
	}

	function randomInt(start, finish) {
		return start + Math.round(finish * Math.random());
	}

	function calculateLevel() {
		var lastLevel = level;
		$.each(levels, function (i, v) {
			if (xp >= v) {
				level = i + 1;
			} else {
				return false;
			}
		});
		if (xp > levels[levels.length - 1]) {
			level += Math.floor((xp - levels[levels.length - 1])/maxLevelGap);
		}
		if (level > lastLevel) {
			log({
				description: 'Leveled up! Reached level ' + level,
				class: 'levelup'
			});
		}
	}

	function log(event) {
		var message = event.description;
		if (event.gain) {
			message += ' Gained ' + event.gain + ' XP';
		}
		$('<div/>')
			.text(message)
			.addClass(event.class)
			.addClass('row')
			.prependTo(display.log);
	}

	function displayProgress() {
		display.xp.text(xp + ' XP');
		display.level.text('Level ' + level);
		display.progress.css('width', calculateProgress() + '%');
	}

	function calculateProgress() {
		var base, goal;

		if (level >= levels.length) {
			base = levels[levels.length-1] + maxLevelGap * (level - levels.length);
			goal = base + maxLevelGap;
		} else {
			base = levels[level - 1];
			goal = levels[level];
		}

		return Math.min(100, 100 * (xp - base) / (goal - base));
	}
});
