import AbstractSeeder from "./AbstractSeeder";

interface TicketData {
  ticket_category_id: number;
  content: string;
}

class TicketSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "ticket", truncate: true });
  }

  run() {
    const parent1Tickets: TicketData[] = [
      {
        ticket_category_id: 1, // Urgence
        content:
          "Bonjour, je vous informe d’un changement urgent de personne habilitée à venir chercher les enfants ce midi. Lucas et Rose seront récupérés par Mme Dubois.",
      },
      {
        ticket_category_id: 2, // Absence
        content:
          "Bonjour, Lucas et Rose seront absents demain car ils ont un rendez-vous médical en fin de matinée.",
      },
      {
        ticket_category_id: 3, // Divers
        content:
          "Bonjour, pourriez-vous me confirmer s’il y a une option sans allergène pour le repas de jeudi ?",
      },
      {
        ticket_category_id: 4, // Autorisation
        content:
          "Bonjour, je vous transmets l'autorisation pour que Lucas participe à la sortie à la médiathèque.",
      },
      {
        ticket_category_id: 2, // Absence
        content:
          "Bonjour, Lucas ne pourra pas venir à l’école aujourd’hui. Il a de la fièvre.",
      },
      {
        ticket_category_id: 3, // Divers
        content:
          "Bonjour, pourriez-vous m’indiquer la procédure pour récupérer une attestation scolaire ?",
      },
    ];

    const parent2Tickets: TicketData[] = [
      {
        ticket_category_id: 1, // Urgence
        content:
          "Bonjour, suite à une difficulté, Léa sortira exceptionnellement à 15h30. Merci .",
      },
      {
        ticket_category_id: 2, // Absence
        content:
          "Bonjour, Léa sera absente vendredi matin pour un rendez-vous chez le médecin.",
      },
      {
        ticket_category_id: 3, // Divers
        content:
          "Bonjour, pouvez-vous me confirmer les horaires de l’étude surveillée ?",
      },
      {
        ticket_category_id: 4, // Autorisation
        content:
          "Bonjour, je vous demande l’autorisation pour la séance photo de classe de Léa.",
      },
      {
        ticket_category_id: 1, // Urgence
        content:
          "Bonjour, Léa a oublié son manteau à l’école hier. L'avez-vous retrouvé ?",
      },
      {
        ticket_category_id: 3, // Divers
        content:
          "Bonjour, y a-t-il une recommandation particulière pour le goûter cette semaine ?",
      },
    ];

    for (let index = 0; index < 6; index++) {
      const ticketForParent1 = parent1Tickets[index];
      this.insert({
        content: ticketForParent1.content,
        parent_id: 1,
        ticket_category_id: ticketForParent1.ticket_category_id,
        refName: `ticket_1_${index}`,
      });

      const ticketForParent2 = parent2Tickets[index];
      this.insert({
        content: ticketForParent2.content,
        parent_id: 2,
        ticket_category_id: ticketForParent2.ticket_category_id,
        refName: `ticket_2_${index}`,
      });
    }
  }
}

export default TicketSeeder;
