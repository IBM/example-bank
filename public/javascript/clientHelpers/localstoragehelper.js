function attendEvent(userSubject, event) {
    let localStorageId = userSubject + '-events'
    let userEvents = localStorage.getItem(localStorageId)

    if (userEvents == null || userEvents == "") {
        let events = []
        events.push(event)
        localStorage.setItem(userSubject + '-events', JSON.stringify(events))
    } else {
        let arrayOfEvents = JSON.parse(userEvents)
        if (arrayOfEvents.filter(e => e.eventId === event.eventId).length > 0) {
            console.log('event exists in local storage')
        } else {
            arrayOfEvents.push(event)
        }
        localStorage.setItem(localStorageId, JSON.stringify(arrayOfEvents))
    }
}

function getStoredEvents(userSubject) {
    let storedEventsString = localStorage.getItem(userSubject + '-events')
    if (storedEventsString == null || storedEventsString == "") return null
    return JSON.parse(storedEventsString)
}

function removeStoredEvent(userSubject, eventId) {
    let localStorageId = userSubject + '-events'
    let storedEvents = getStoredEvents(userSubject)
    storedEvents = storedEvents.filter(e => e.eventId != eventId)
    localStorage.setItem(localStorageId, JSON.stringify(storedEvents))
}
