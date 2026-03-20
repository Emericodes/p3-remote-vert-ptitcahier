import AbstractSeeder from "./AbstractSeeder";

class AnnouncementSeeder extends AbstractSeeder {
  constructor() {
    super({
      table: "announcement",
      truncate: true,
    });
  }

  run() {
    const announcements = [
      {
        title: "Photos de classe",
        content:
          "Le photographe scolaire sera présent lundi 17 mars toute la matinée. Les photos individuelles et de groupe seront prises dans la salle polyvalente. Merci de veiller à ce que les enfants arrivent à l'heure et soient bien coiffés pour l'occasion.",
        created_at: "2025-09-10 12:15:00",
        announcement_category_id: 1,
        school_id: 1,
        image_url: null,
      },
      {
        title: "Don de livres pour la bibliothèque",
        content:
          "Nous organisons une grande collecte de livres jeunesse pour enrichir notre coin lecture. Romans, albums illustrés, BD, documentaires : tout est le bienvenu ! Vous pouvez déposer vos dons à l'accueil de l'école jusqu'au vendredi 28 mars.",
        created_at: "2025-11-05 07:15:00",
        announcement_category_id: 1,
        school_id: 1,
        image_url: "/images/announcements/giving_books.jpg",
      },
      {
        title: "Nouveau coin lecture aménagé",
        content:
          "Grâce à vos généreux dons de livres, un tout nouveau coin lecture a été aménagé dans le préau couvert. Les élèves pourront en profiter pendant les récréations et les temps calmes. Un grand merci à l'association des parents pour le financement des coussins et des étagères.",
        created_at: "2026-01-15 16:20:00",
        announcement_category_id: 1,
        school_id: 1,
        image_url: "/images/announcements/reading_corner.jpg",
      },
      {
        title: "Permis Piéton pour les CE2",
        content:
          "Dans le cadre de l'éducation à la sécurité routière, les gendarmes de la brigade de prévention interviendront jeudi 20 mars dans la classe de CE2. Les élèves passeront un petit examen pour obtenir leur Permis Piéton. Bonne chance à nos futurs marcheurs responsables !",
        created_at: "2025-10-20 09:00:00",
        announcement_category_id: 1,
        school_id: 1,
        image_url: "/images/announcements/road_safety.jpg",
      },
      {
        title: "Intervention sur le tri sélectif",
        content:
          "Un animateur de la communauté d'agglomération viendra sensibiliser les élèves de CM1 et CM2 au tri des déchets et au recyclage, le mardi 25 mars de 14h à 15h30. Les enfants sont invités à apporter un emballage vide de la maison pour l'atelier pratique.",
        created_at: "2026-01-28 08:45:00",
        announcement_category_id: 1,
        school_id: 1,
        image_url: "/images/announcements/recycling_bins.jpg",
      },
      {
        title: "Semaine du goût : ateliers cuisine",
        content:
          "À l'occasion de la Semaine du goût, des ateliers cuisine seront organisés dans chaque classe du 13 au 17 octobre. Les parents volontaires pour encadrer les ateliers sont priés de se signaler auprès de l'enseignant de leur enfant avant le 6 octobre.",
        created_at: "2025-10-09 07:30:00",
        announcement_category_id: 1,
        school_id: 1,
        image_url: "/images/announcements/cooking_workshop.jpg",
      },
      {
        title: "Épidémie de grippe — Rappel sanitaire",
        content:
          "Plusieurs cas de grippe ont été signalés dans les classes de CP et CE1 ces derniers jours. Nous vous rappelons les gestes barrières essentiels : lavage fréquent des mains, mouchoir à usage unique, et toux dans le coude. En cas de fièvre supérieure à 38°C, merci de garder votre enfant à la maison et de prévenir l'école.",
        created_at: "2025-10-01 14:45:00",
        announcement_category_id: 2,
        school_id: 1,
        image_url: "/images/announcements/plush_teddy.jpg",
      },
      {
        title: "Fermeture exceptionnelle de la cantine",
        content:
          "En raison d'un mouvement de grève du personnel municipal, la cantine sera fermée ce jeudi 13 mars. Les familles sont priées de prévoir un panier repas pour leur enfant. L'accueil périscolaire du matin et du soir fonctionnera normalement.",
        created_at: "2025-12-17 13:00:00",
        announcement_category_id: 2,
        school_id: 1,
        image_url: "/images/announcements/school_cafeteria.jpg",
      },
      {
        title: "Mise à jour des fiches de renseignements",
        content:
          "Nous vous demandons de vérifier et mettre à jour les fiches de renseignements de vos enfants avant le 31 mars. Numéros de téléphone, adresse, personnes autorisées à récupérer l'enfant : toute modification doit être signalée au secrétariat.",
        created_at: "2025-09-03 06:30:00",
        announcement_category_id: 2,
        school_id: 1,
        image_url: null,
      },
      {
        title: "Rappel : assurance scolaire obligatoire",
        content:
          "Pour toute participation aux sorties scolaires, l'attestation d'assurance responsabilité civile et individuelle accident est obligatoire. Merci de transmettre le document au plus vite si ce n'est pas déjà fait. Sans cette attestation, votre enfant ne pourra pas participer aux activités extérieures.",
        created_at: "2025-12-01 09:45:00",
        announcement_category_id: 2,
        school_id: 1,
        image_url: "/images/announcements/school_assurance.jpg",
      },
      {
        title: "Grève nationale — Organisation du 18 mars",
        content:
          "En raison du mouvement de grève nationale annoncé pour le mardi 18 mars, un service minimum d'accueil sera mis en place. Seules les classes de CP et CM2 seront assurées. Les familles concernées par les autres niveaux sont invitées à prendre leurs dispositions.",
        created_at: "2026-02-14 07:00:00",
        announcement_category_id: 2,
        school_id: 1,
        image_url: "/images/announcements/school_strike.jpg",
      },
      {
        title: "Horaires de la rentrée de janvier",
        content:
          "La rentrée après les vacances de Noël aura lieu le lundi 6 janvier à 8h30. L'accueil périscolaire reprendra dès 7h30. Le service de cantine fonctionnera normalement dès le premier jour.",
        created_at: "2026-01-06 07:00:00",
        announcement_category_id: 2,
        school_id: 1,
        image_url: "/images/announcements/winter_time.jpg",
      },
      {
        title: "Spectacle de Noël — Invitation",
        content:
          "Le traditionnel spectacle de Noël de l'école se tiendra le vendredi 19 décembre à 18h à la salle des fêtes municipale. Chaque classe présentera un numéro préparé avec soin. Un goûter offert par l'association des parents clôturera la soirée. Entrée libre, venez nombreux !",
        created_at: "2025-09-22 08:00:00",
        announcement_category_id: 3,
        school_id: 1,
        image_url: "/images/announcements/christmas_show.jpg",
      },
      {
        title: "Sortie à la ferme pédagogique",
        content:
          "Le mardi 10 février, les élèves de CP partiront à la découverte de la ferme pédagogique des Quatre Saisons. Au programme : visite des animaux, atelier fabrication de beurre et balade en tracteur. Départ en bus à 9h, retour prévu à 16h. Prévoir des bottes en caoutchouc et un pique-nique.",
        created_at: "2025-11-18 14:30:00",
        announcement_category_id: 3,
        school_id: 1,
        image_url: "/images/announcements/farme_education.jpg",
      },
      {
        title: "Alerte météo — Sortie annulée",
        content:
          "En raison des vents violents annoncés par Météo France (vigilance orange), la sortie en forêt de Sénart prévue cet après-midi pour les CE1 est annulée pour des raisons de sécurité. Les élèves resteront en classe avec un programme adapté. La sortie sera reprogrammée ultérieurement.",
        created_at: "2026-02-05 10:30:00",
        announcement_category_id: 3,
        school_id: 1,
        image_url: "/images/announcements/alerte_meteo.jpg",
      },
      {
        title: "Carnaval de l'école",
        content:
          "Le carnaval aura lieu le vendredi 14 février. Les enfants sont invités à venir déguisés dès le matin. Un défilé dans le quartier est prévu à 14h30, suivi d'un goûter offert par l'association des parents dans la cour de l'école. Pas de confettis à l'intérieur des bâtiments, merci !",
        created_at: "2025-12-12 06:50:00",
        announcement_category_id: 3,
        school_id: 1,
        image_url: "/images/announcements/school_carnival.jpg",
      },
      {
        title: "Kermesse de fin d'année",
        content:
          "La kermesse de fin d'année se déroulera le samedi 28 juin de 14h à 18h dans la cour de l'école. Au programme : stands de jeux, tombola, buvette et spectacle des élèves. L'association des parents recherche des volontaires pour la tenue des stands. Inscrivez-vous au tableau d'affichage !",
        created_at: "2026-03-03 12:15:00",
        announcement_category_id: 3,
        school_id: 1,
        image_url: "/images/announcements/kermesse.jpg",
      },
      {
        title: "Visite guidée au Musée du Chocolat",
        content:
          "Le jeudi 3 avril, les classes de CE2 et CM1 se rendront au Musée du Chocolat à Paris pour une visite guidée suivie d'un atelier dégustation. Rendez-vous à 8h30 dans la cour, devant le bus. Retour prévu vers 16h30. Merci de prévoir un pique-nique sans chocolat... l'ironie serait trop grande !",
        created_at: "2026-03-06 09:00:00",
        announcement_category_id: 3,
        school_id: 1,
        image_url: "/images/announcements/chocolate_museum.jpg",
      },
    ];

    for (let i = 0; i < announcements.length; i++) {
      this.insert({
        ...announcements[i],
        refName: `announcement_1_${i}`,
      });
    }
  }
}

export default AnnouncementSeeder;
