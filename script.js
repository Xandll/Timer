console.log('Script loaded');

class CountDown {
    constructor(format, time, title) {
        this.format = format;
        this.time = time.replaceAll('_', ',');
        this.time = this.time.replaceAll(':', ',');
        this.time = this.time.replaceAll('-', ',');
        this.time = this.time.replaceAll(' ', ',');
        this.time = this.time.split(',');
        this.time = new Date(
            this.time[0],
            this.time[1] - 1,
            this.time[2],
            this.time[3],
            this.time[4],
            this.time[5],
            this.time[6]
        );
        this.time = this.time.getTime();
        this.now = new Date().getTime();
        this.diff = this.time - this.now;

        // Convert millisecond difference to time units
        const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
        const msPerMonth = msPerYear / 12;
        const msPerDay = 1000 * 60 * 60 * 24;
        const msPerHour = 1000 * 60 * 60;
        const msPerMinute = 1000 * 60;
        const msPerSecond = 1000;

        this.year = Math.floor(this.diff / msPerYear);
        this.month = Math.floor((this.diff % msPerYear) / msPerMonth);
        this.day = Math.floor((this.diff % msPerMonth) / msPerDay);
        this.hours = Math.floor((this.diff % msPerDay) / msPerHour);
        this.minutes = Math.floor((this.diff % msPerHour) / msPerMinute);
        this.seconds = Math.floor((this.diff % msPerMinute) / msPerSecond);
        this.milliseconds = Math.floor(this.diff % msPerSecond);

        this.title = title;
        this.id = 'countdown-' + Math.random().toString(36).substr(2, 9);
    }

    // Save timer to local storage
    saveToLocalStorage() {
        const timers = JSON.parse(localStorage.getItem('timers')) || [];
        timers.push({
            id: this.id,
            format: this.format,
            time: this.time,
            title: this.title,
            dateTime: new Date(this.time).toISOString() // Store the original datetime
        });
        localStorage.setItem('timers', JSON.stringify(timers));
    }

    // Remove timer from local storage
    removeFromLocalStorage() {
        const timers = JSON.parse(localStorage.getItem('timers')) || [];
        const updatedTimers = timers.filter(timer => timer.id !== this.id);
        localStorage.setItem('timers', JSON.stringify(updatedTimers));
    }

    updateDiff() {
        this.now = new Date().getTime();
        this.diff = this.time - this.now;

        // Convert millisecond difference to time units
        const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
        const msPerMonth = msPerYear / 12;
        const msPerDay = 1000 * 60 * 60 * 24;
        const msPerHour = 1000 * 60 * 60;
        const msPerMinute = 1000 * 60;
        const msPerSecond = 1000;

        if (this.diff <= 0) {
            this.year = 0;
            this.month = 0;
            this.day = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
            this.milliseconds = 0;
            return;
        }

        this.year = Math.floor(this.diff / msPerYear);
        this.month = Math.floor((this.diff % msPerYear) / msPerMonth);
        this.day = Math.floor((this.diff % msPerMonth) / msPerDay);
        this.hours = Math.floor((this.diff % msPerDay) / msPerHour);
        this.minutes = Math.floor((this.diff % msPerHour) / msPerMinute);
        this.seconds = Math.floor((this.diff % msPerMinute) / msPerSecond);
        this.milliseconds = Math.floor(this.diff % msPerSecond);
    }

    render() {
        const timersContainer = document.getElementById('timers-container');
        if (!timersContainer) return;

        // Check if timer already exists and remove it
        const existingTimer = document.getElementById(this.id);
        if (existingTimer) {
            existingTimer.remove();
        }

        let container = document.createElement('div');
        container.classList.add('countdown-container');
        container.id = this.id;

        // Add delete button
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-timer');
        deleteButton.innerHTML = '✖';
        deleteButton.onclick = () => this.deleteTimer();
        container.appendChild(deleteButton);

        // Add share button
        let shareButton = document.createElement('button');
        shareButton.classList.add('share-timer');
        shareButton.innerHTML = '🔗';
        shareButton.onclick = () => this.shareTimer();
        container.appendChild(shareButton);

        let title = document.createElement('h1');
        title.textContent = this.title;
        container.appendChild(title);

        if (this.format.includes('YYYY')) {
            let yearDiv = document.createElement('div');
            yearDiv.classList.add('year');
            yearDiv.innerHTML = `<span class="number"></span><span class="label">Years</span>`;
            container.appendChild(yearDiv);
        }
        if (this.format.includes('MM')) {
            let monthDiv = document.createElement('div');
            monthDiv.classList.add('month');
            monthDiv.innerHTML = `<span class="number"></span><span class="label">Months</span>`;
            container.appendChild(monthDiv);
        }
        if (this.format.includes('dd')) {
            let dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.innerHTML = `<span class="number"></span><span class="label">Days</span>`;
            container.appendChild(dayDiv);
        }
        if (this.format.includes('hh')) {
            let hourDiv = document.createElement('div');
            hourDiv.classList.add('hour');
            hourDiv.innerHTML = `<span class="number"></span><span class="label">Hours</span>`;
            container.appendChild(hourDiv);
        }
        if (this.format.includes('mm')) {
            let minuteDiv = document.createElement('div');
            minuteDiv.classList.add('minute');
            minuteDiv.innerHTML = `<span class="number"></span><span class="label">Minutes</span>`;
            container.appendChild(minuteDiv);
        }
        if (this.format.includes('ss')) {
            let secondDiv = document.createElement('div');
            secondDiv.classList.add('second');
            secondDiv.innerHTML = `<span class="number"></span><span class="label">Seconds</span>`;
            container.appendChild(secondDiv);
        }
        if (this.format.includes('ms')) {
            let millisecondDiv = document.createElement('div');
            millisecondDiv.classList.add('millisecond');
            millisecondDiv.innerHTML = `<span class="number"></span><span class="label">MS</span>`;
            container.appendChild(millisecondDiv);
        }

        timersContainer.appendChild(container);

        const elements = {
            time: document.querySelector(`#${this.id}`),
            year: this.format.includes('YYYY') ? document.querySelector(`#${this.id} .year .number`) : null,
            month: this.format.includes('MM') ? document.querySelector(`#${this.id} .month .number`) : null,
            day: this.format.includes('dd') ? document.querySelector(`#${this.id} .day .number`) : null,
            hour: this.format.includes('hh') ? document.querySelector(`#${this.id} .hour .number`) : null,
            minute: this.format.includes('mm') ? document.querySelector(`#${this.id} .minute .number`) : null,
            second: this.format.includes('ss') ? document.querySelector(`#${this.id} .second .number`) : null,
            millisecond: this.format.includes('ms') ? document.querySelector(`#${this.id} .millisecond .number`) : null,
        };

        this.updateElements(elements);
        this.saveToLocalStorage(); // Save timer to local storage

        // Optimize animation frame handling
        this.animationId = null;
        this.lastUpdate = 0;
        const FPS = 30; // Limit updates to 30fps
        const frameInterval = 1000 / FPS;

        const updateTimer = (timestamp) => {
            if (!document.getElementById(this.id)) {
                cancelAnimationFrame(this.animationId);
                return;
            }

            // Only update if enough time has passed
            if (timestamp - this.lastUpdate >= frameInterval) {
                this.updateDiff();
                this.updateElements(elements);
                this.lastUpdate = timestamp;
            }

            this.animationId = requestAnimationFrame(updateTimer);
        };

        this.animationId = requestAnimationFrame(updateTimer);
    }

    shareTimer() {
        const timerData = {
            format: this.format,
            time: this.time,
            title: this.title,
            dateTime: new Date(this.time).toISOString()
        };
        
        console.log('Sending data:', timerData);
        
        const shareButton = document.querySelector(`#${this.id} .share-timer`);
        if (shareButton) {
            shareButton.disabled = true;
            shareButton.style.opacity = '0.5';
        }
    
        fetch('/api/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(timerData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Server error: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (!data.shareId) {
                throw new Error('No share ID received');
            }
            const shareUrl = `${window.location.origin}/share/${data.shareId}`;
            return navigator.clipboard.writeText(shareUrl)
                .then(() => alert('Share link copied to clipboard!'))
                .catch(() => {
                    // Fallback wenn Clipboard API nicht verfügbar
                    prompt('Copy this link:', shareUrl);
                });
        })
        .catch(error => {
            console.error('Share error:', error);
            alert('Failed to share timer. Please try again.');
        })
        .finally(() => {
            if (shareButton) {
                shareButton.disabled = false;
                shareButton.style.opacity = '1';
            }
        });
    }

    deleteTimer() {
        const container = document.querySelector(`#${this.id}`);
        if (container) {
            // Stop the animation
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }

            // Remove from DOM with animation
            container.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                this.removeFromLocalStorage(); // Remove timer from local storage
                container.remove();
            }, 300);
        }
    }

    updateElements(elements) {
        if (this.diff <= 0) {
            document.querySelector(`#${this.id}`).innerHTML = `<h1 class="title">${this.title}</h1><div class="end-text">Time's Up! 🎉</div>`;
            // Add a celebratory animation effect
            const container = document.querySelector(`#${this.id}`);
            container.style.animation = 'celebrate 1s ease-in-out';

            // Add keyframe animation if it doesn't exist
            if (!document.querySelector('#celebrationKeyframes')) {
                const keyframes = document.createElement('style');
                keyframes.id = 'celebrationKeyframes';
                keyframes.textContent = `
                    @keyframes celebrate {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        75% { transform: rotate(5deg) scale(1.1); }
                        85% { transform: rotate(-5deg) scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(keyframes);
            }

            // Create and launch confetti in batches
            const totalConfetti = 30; // Reduced number
            const batchSize = 5;
            const colors = ['#ff0', '#f0f', '#0ff', '#0f0'];
            let count = 0;

            function createConfettiBatch() {
                if (count >= totalConfetti) return;

                const fragment = document.createDocumentFragment();

                for (let i = 0; i < batchSize && count < totalConfetti; i++, count++) {
                    const confetti = document.createElement('div');
                    confetti.style.cssText = `
                        position: fixed;
                        width: 8px; 
                        height: 8px;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        left: ${Math.random() * 100}vw;
                        top: -20px;
                        opacity: 1;
                        transform: rotate(${Math.random() * 360}deg);
                        pointer-events: none;
                        will-change: transform;
                        animation: fall ${2 + Math.random() * 2}s linear forwards;
                    `;

                    confetti.addEventListener('animationend', () => confetti.remove());
                    fragment.appendChild(confetti);
                }

                document.body.appendChild(fragment);

                if (count < totalConfetti) {
                    requestAnimationFrame(createConfettiBatch);
                }
            }

            // Add fall animation if it doesn't exist
            if (!document.querySelector('#fallKeyframes')) {
                const fallKeyframes = document.createElement('style');
                fallKeyframes.id = 'fallKeyframes';
                fallKeyframes.textContent = `
                    @keyframes fall {
                        to {
                            transform: translateY(100vh) rotate(720deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(fallKeyframes);
            }

            createConfettiBatch();
            return;
        }
        if (elements.year) elements.year.textContent = this.year;
        if (elements.month) elements.month.textContent = this.month;
        if (elements.day) elements.day.textContent = this.day;
        if (elements.hour) elements.hour.textContent = this.hours;
        if (elements.minute) elements.minute.textContent = this.minutes;
        if (elements.second) elements.second.textContent = this.seconds;
        if (elements.millisecond) elements.millisecond.textContent = this.milliseconds;
    }
}

// Helper function to format the date for the timer
function formatDateForTimer(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${
        (date.getMonth() + 1).toString().padStart(2, '0')}-${
        date.getDate().toString().padStart(2, '0')}_${
        date.getHours().toString().padStart(2, '0')}:${
        date.getMinutes().toString().padStart(2, '0')}:${
        date.getSeconds().toString().padStart(2, '0')}:${
        date.getMilliseconds().toString().padStart(3, '0')}`;
}

// Central initialization function
function initializeApp() {
    const timersContainer = document.getElementById('timers-container');
    if (!timersContainer) return;
    
    timersContainer.innerHTML = '';
    
    // Get timers from storage
    const timers = JSON.parse(localStorage.getItem('timers')) || [];
    
    // Sort timers by closest to expiration
    timers.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    // Batch render timers
    const batchSize = 3;
    let currentBatch = 0;
    
    function renderBatch() {
        const start = currentBatch * batchSize;
        const end = Math.min(start + batchSize, timers.length);
        
        for (let i = start; i < end; i++) {
            const timer = timers[i];
            const dateTime = formatDateForTimer(new Date(timer.dateTime).getTime());
            const newCountdown = new CountDown(timer.format, dateTime, timer.title);
            newCountdown.id = timer.id;
            newCountdown.render();
        }
        
        currentBatch++;
        
        // If there are more timers to render, schedule next batch
        if (currentBatch * batchSize < timers.length) {
            setTimeout(renderBatch, 100);
        }
    }
    
    // Start rendering batches
    if (timers.length > 0) {
        renderBatch();
    }

    // Event Listener for the form
    const form = document.getElementById('timerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('timerTitle').value;
            const dateTime = document.getElementById('timerDateTime').value;
            const format = document.getElementById('timerFormat').value;

            requestAnimationFrame(() => {
                const date = new Date(dateTime);
                const formattedDateTime = formatDateForTimer(date.getTime());
                const newCountdown = new CountDown(format, formattedDateTime, title);
                newCountdown.render();
                this.reset();
            });
        });
    }
}

// Add this helper function to clean up expired timers
function cleanupExpiredTimers() {
    const timers = JSON.parse(localStorage.getItem('timers')) || [];
    const now = new Date().getTime();
    const activeTimers = timers.filter(timer => new Date(timer.dateTime).getTime() > now);
    localStorage.setItem('timers', JSON.stringify(activeTimers));
}

// Optimize loadSharedTimer function
function loadSharedTimer() {
    const path = window.location.pathname;
    if (!path.startsWith('/share/')) return;

    const shareId = path.split('/share/')[1];
    
    // Clear all existing timers first
    const timersContainer = document.getElementById('timers-container');
    if (timersContainer) {
        timersContainer.innerHTML = '';
    }

    // Hide the form container
    const formContainer = document.querySelector('.timer-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }

    // Remove existing "Create New Timer" button if it exists
    const existingBtn = document.querySelector('.new-timer-btn');
    if (existingBtn) {
        existingBtn.remove();
    }

    fetch(`/api/share/${shareId}`)
        .then(response => response.ok ? response.json() : Promise.reject('Timer not found'))
        .then(timerData => {
            const dateTime = formatDateForTimer(new Date(timerData.dateTime).getTime());
            const newCountdown = new CountDown(timerData.format, dateTime, timerData.title);
            
            // Don't save shared timer to localStorage
            newCountdown.saveToLocalStorage = () => {}; 
            
            newCountdown.render();
            
            // Add "Create New Timer" button only if it doesn't exist
            if (!document.querySelector('.new-timer-btn')) {
                const newTimerBtn = document.createElement('button');
                newTimerBtn.textContent = 'Create New Timer';
                newTimerBtn.classList.add('new-timer-btn');
                newTimerBtn.onclick = () => {
                    window.location.href = '/';
                };
                document.body.insertBefore(newTimerBtn, timersContainer);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (timersContainer) {
                timersContainer.innerHTML = `
                    <div class="error-message">
                        <h2>Timer not found</h2>
                        <p>The shared timer may have expired or been removed.</p>
                        <button class="new-timer-btn" onclick="window.location.href='/'">
                            Create New Timer
                        </button>
                    </div>
                `;
            }
        });
}

// Move fallbackCopy outside of the class as a standalone function
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        textArea.remove();
        alert('Share link copied to clipboard!');
    } catch (err) {
        console.error('Error copying text:', err);
        textArea.remove();
        alert('Could not copy link: ' + text);
    }
}

// Modify the window load event listener to prevent multiple initializations
window.addEventListener('load', () => {
    const isSharedTimer = window.location.pathname.startsWith('/share/');
    if (isSharedTimer) {
        loadSharedTimer();
    } else {
        cleanupExpiredTimers();
        initializeApp();
    }
}, { once: true });
