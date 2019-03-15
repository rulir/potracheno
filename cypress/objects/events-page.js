class EventsPage {
	root() {
		return cy.get('[data-marker="events-page"]');
	}

	placeholder() {
		return cy.get('[data-marker="events-page/placeholder"]');
	}

	addEventButton() {
		return cy.get('[data-marker="events-page/add-event"]');
	}
}

export const eventsPage = new EventsPage();
