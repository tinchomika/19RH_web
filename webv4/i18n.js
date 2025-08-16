const translations = {
    es: {
        home: 'Inicio',
        scoreboard: 'Estadisticas',
        donations: 'Donaciones',
        language_button: 'English',
        welcome_message: 'Bienvenido a La Taberna Hispana',
        welcome_subtitle: "Somos ese grupito que habla español en medio de videojuegos con una base de jugadores principalmente anglo-parlantes ",
        about_title: 'Sobre el clan',
        about_p_1: `Somos una comunidad hispano-hablante centrada en diversos juegos históricos donde no predomina nuestro idioma.`,
        about_p_2: `Contamos con un servidor público de Darkest Hour y un servidor de Discord donde podés unirte para charlar
                    sobre el juego, organizar eventos y demás.`,
        about_p_3: `Aunque nuestro servidor está alojado en Sudamérica y el idioma principal es el
                    español, ¡todos son bienvenidos!`,
        join_title: '¡Jugá con nosotros!',
        join_server_title: 'Servidor de Darkest Hour',
        join_discord_title: 'Encontranos en Discord',
        join_discord_button: '¡Unite a nuestro Discord!',
        online_players_title: 'Jugadores en línea',
        loading: 'Cargando...',
        no_players: 'No hay jugadores conectados',
        player: 'Jugador',
        score: 'Puntaje',
        team: 'Equipo',
        ping: 'Ping',
        top_players_title: 'Mejores Jugadores',
        top_players_subtitle: 'Basado en el puntaje total de las ultimas 100 partidas',
        no_players_found: 'No se encontraron jugadores.',
        position: 'Posición',
        total_score: 'Puntaje Total',
        games_played: 'Partidas',
        recent_games_title: 'Partidas recientes',
        recent_games_subtitle: 'Últimas batallas jugadas con +500 puntos',
        no_games_found: 'No se encontraron partidas.',
        donations_title: 'Donaciones',
        donations_subtitle: '¡Ayuda a mantener vivo el server!',
        donors_title: 'Agradecimientos',
        donors_p: `Aquí están los nombres de las personas que han donado al servidor:<br> <strong>Petri I.</strong> <br>¿Ya donaste y tu nombre no aparece aquí? <a href= "https://discord.gg/QdmFXbNQvq" target="_blank" class="text-blue-400 hover:underline">Contáctanos en Discord!</a>`,
        footer_p: `&copy; 2025 Equipo administrador del 19RH. Esta página es mantenida por <a href="https://tinchomika.com/" target="_blank" class="text-blue-400 hover:underline"> Dino </a>`

    },
    en: {
        home: 'Home',
        scoreboard: 'Scoreboard',
        donations: 'Donations',
        language_button: 'Español',
        welcome_message: "Welcome to La Taberna Hispana",
        welcome_subtitle: 'We are a spanish speaking community for Darkest Hour and various historical games',
        about_title: 'About the group',
        about_p_1: `We enjoy playing historical games, but we commonly do not share our language with the rest of the community, thats why we created La Taberna Hispana, a place where all spanish speakers can reunite.`,
        about_p_2: `Currently, we have a public server in Darkest Hour, as well as a Discord server where we discuss about
                    the game.`,
        about_p_3: `Although the server is hosted in South America and spanish is the main language spoken,
                    everyone is welcome!.`,
        join_title: 'Join us!',
        join_server_title: 'Darkest Hour server',
        join_discord_title: 'Discord',
        join_discord_button: 'Join our Discord!',
        online_players_title: 'Online Players',
        loading: 'Loading...',
        no_players: 'No players connected',
        player: 'Player',
        score: 'Score',
        team: 'Team',
        ping: 'Ping',
        top_players_title: 'Top Players',
        top_players_subtitle: 'Based on the total score of the last 100 games',
        no_players_found: 'No players found.',
        position: 'Position',
        total_score: 'Total Score',
        games_played: 'Games Played',
        recent_games_title: 'Recent Games',
        recent_games_subtitle: 'Last games played with +500 points',
        no_games_found: 'No games found.',
        donations_title: 'Donations',
        donations_subtitle: 'Support our community server!',
        donors_title: 'Donors',
        donors_p: `Here are the names of the people who have helped us to keep the server running: <br> <strong>Petri I.</strong> <br>Already donated and your name is not here? <a href= "https://discord.gg/QdmFXbNQvq" target="_blank" class="text-blue-400 hover:underline">Contact us on Discord!</a>`,
        footer_p: `&copy; 2025 19RH Admin team. This page is maintained by <a href="https://tinchomika.com/" target="_blank" class="text-blue-400 hover:underline"> Dino </a>`
    }
};

document.addEventListener('alpine:init', () => {
    Alpine.data('i18n', () => ({
        lang: 'es',
        t(key) {
            return translations[this.lang][key];
        }
    }));
});