    //fullscreen test
    const title = document.getElementById('recent-games-header');
    const modal = document.getElementById('recentGamesModal');
    const modalContent = document.getElementById('modalContent');
    const modalData = document.getElementById('modalData');

    title.addEventListener('click', async () => {
        openModal();
    });

    // Cierra la pantalla completa al hacer clic fuera del área del título
    document.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    async function openModal() {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        const games = await fetchAndUpdateRecentGames();
        modalData.innerHTML = games.map(game => createGameTable(game)).join('<div style="margin: 20px 0;"></div>');
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        modal.classList.remove('modal-open');
    }
    //boton idioma
    function toggleLanguage() {
        const lang = document.documentElement.lang === 'en' ? 'es' : 'en';
        document.documentElement.lang = lang;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    document.querySelectorAll('.content-section').forEach((section) => {
        observer.observe(section);
    });
    document.addEventListener('DOMContentLoaded', function () {
        const carousel = document.querySelector('.carousel');
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const indicatorsContainer = document.querySelector('.indicators');
        let currentSlide = 0;
        let autoplayInterval;
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
        const indicators = document.querySelectorAll('.indicator');
        function updateSlidePosition() {
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            if (currentSlide >= slides.length) currentSlide = 0;
            updateSlidePosition();
            resetAutoplay();
        }
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }
        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        let touchStartX = 0;
        let touchEndX = 0;
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) nextSlide();
            if (touchEndX - touchStartX > 50) prevSlide();
        });
        startAutoplay();
    });
    async function loadPlayers() {
        try {
            const response = await fetch('https://api.tinchomika.com/dh/api/dh-info');
            const data = await response.json();
            const playerContainer = document.getElementById('player-container');
            playerContainer.innerHTML = '';
            if (data.length === 0) {
                playerContainer.innerHTML = '<p class="no-players" lang="es">No hay jugadores conectados</p><p class="no-players" lang="en">No players connected</p>';
            } else {
                const table = document.createElement('table');
                table.classList.add('player-table');
                const headerRow = document.createElement('tr');
                const headers = [
                    { es: "Jugador", en: "Player" },
                    { es: "Puntaje", en: "Score" },
                    { es: "Equipo", en: "Team" },
                    { es: "Ping", en: "Ping" }
                ];
                headers.forEach(header => {
                    const th = document.createElement('th');
                    const esHeader = document.createElement('p');
                    esHeader.setAttribute('lang', 'es');
                    esHeader.textContent = header.es;
                    const enHeader = document.createElement('p');
                    enHeader.setAttribute('lang', 'en');
                    enHeader.textContent = header.en;
                    th.appendChild(esHeader);
                    th.appendChild(enHeader);
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);
                data.sort((a, b) => {
                    if (a.equipo === b.equipo) {
                        return b.score - a.score;
                    }
                    return a.equipo.localeCompare(b.equipo);
                });
                data.forEach(player => {
                    const team = player.equipo === "Blue" ? "Allies" : player.equipo === "Red" ? "Axis" : player.equipo;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${player.jugador}</td>
                        <td>${player.score || 0}</td>
                        <td>${team || 0}</td>
                        <td>${player.ping || 0}</td>
                    `;
                    table.appendChild(row);
                });
                playerContainer.appendChild(table);
            }
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }
    loadPlayers();
    function formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    function createTopPlayersTable(players) {
        return `
            <table>
                <thead>
                    <tr>
                        <th lang="es">Posición</th>
                        <th lang="en">Position</th>
                        <th lang="es">Jugador</th>
                        <th lang="en">Player</th>
                        <th lang="es">Puntaje Total</th>
                        <th lang="en">Total Score</th>
                        <th lang="es">Partidas</th>
                        <th lang="en">Games Played</th>
                    </tr>
                </thead>
                <tbody>
                    ${players.map((player, index) => `
                        <tr>
                            <td>#${index + 1}</td>
                            <td>${player.player_name}</td>
                            <td>${player.total_score}</td>
                            <td>${player.games_played}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    function createGameTable(game) {
        return `
            <div class="map-info">
                <span class="map-name">${game.map}</span>
                <span class="date-info">${formatDate(game.date)}</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th lang="es">Jugador</th>
                        <th lang="en">Player</th>
                        <th lang="es">Equipo</th>
                        <th lang="en">Team</th>
                        <th lang="es">Puntaje</th>
                        <th lang="en">Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${game.players
                .sort((a, b) => {
                    if (a.team !== b.team) return a.team.localeCompare(b.team);
                    return b.score - a.score;
                })
                .map(player => {
                    const team = player.team === "Blue" ? "Allies" : player.team === "Red" ? "Axis" : player.team;
                    return `
                    <tr class="team-${team.toLowerCase()}">
                        <td>${player.player_name}</td>
                        <td>${team}</td>
                        <td>${player.score}</td>
                    </tr>
                `;
                }).join('')}
                </tbody>
            </table>
        `;
    }
    async function fetchAndUpdateTopPlayers() {
        try {
            const response = await fetch('https://api.tinchomika.com/dh/scoreboard/top-players');
            const players = await response.json();
            document.getElementById('top-players').innerHTML = createTopPlayersTable(players);
        } catch (error) {
            console.error('Error fetching top players:', error);
            document.getElementById('top-players').innerHTML = '<div class="error">Error al cargar los datos</div>';
        }
    }
    async function fetchAndUpdateRecentGames() {
        try {
            const response = await fetch('https://api.tinchomika.com/dh/scoreboard/recent-games');
            const games = await response.json();
            return games;
        } catch (error) {
            console.error('Error fetching recent games:', error);
            return [];
        }
    }
    async function fetchAndUpdateRecentGamesForMain() {
        const games = await fetchAndUpdateRecentGames();
        document.getElementById('recent-games').innerHTML =
            games.slice(0, 7).map(game => createGameTable(game)).join('<div style="margin: 20px 0;"></div>');
    }
    fetchAndUpdateTopPlayers();
    fetchAndUpdateRecentGamesForMain();
    setInterval(() => {
        fetchAndUpdateTopPlayers();
        fetchAndUpdateRecentGamesForMain();
    }, 60000);

