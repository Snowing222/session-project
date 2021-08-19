function fetchData(){
    const URL ="https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=ae3dd0c5961f7351181e57c6eabd"

    fetch(URL).then(resp=> resp.json()).then(data=> {
        console.log(data.events)
        generateSessionByUser(data.events)
    })
}

fetchData()

function generateSessionByUser(events){
    events.sort((e1, e2) => (e1.timestamp - e2.timestamp))
    const map = new Map()
    events.forEach(ele => {
        if (!map.has(ele.visitorId)) {
            map.set(ele.visitorId, new Map());
        }
        map.get(ele.visitorId).set(ele.timestamp, ele.url);
    })

    let sessionsByUser = {}
    map.forEach((url, user) => {
        const timestamps = Array.from(url.keys());
        const sessions = getSessions(timestamps, url);
        
        sessionsByUser[user] = sessions;
        
    })
    console.log(sessionsByUser)

    sendResult(sessionsByUser)
}

function getSessions(timestamps, url) {

    let start = 0;
    let sessions = []
    sessions.push({
        duration: 0,
        pages: [url.get(timestamps[0])],
        startTime: timestamps[0]
    })
    for (let i = 1; i < timestamps.length ; i++) {
        if (timestamps[i] - timestamps[start] <= 600000) {
            let session = sessions[sessions.length - 1];
            session.duration = timestamps[i] - timestamps[start];
            session.pages.push(url.get(timestamps[i]));

        } else {
            sessions.push({
                duration: 0,
                pages: [url.get(timestamps[i])],
                startTime: timestamps[i]
            })
            start = i;
        }
    }
    return sessions;
}

function sendResult(sessionsByUser){
    
    const URL = "https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=ae3dd0c5961f7351181e57c6eabd"
    const data = {"sessionsByUser":sessionsByUser}
    console.log(data)
    fetch(URL, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
}




// let events = data.events;
// events.sort((e1, e2) => (e1.timestamp - e2.timestamp));

// class User {
    
//     constructor() {
//         this.startTime = null;
//         this.events = {};
//     }
    
//     addEvent(event) {
//         if(this.startTime == null || (event.timestamp - this.startTime > 600000)) {
//             this.startTime = event.timestamp;
//             this.events[event.timestamp] = {
//                 duration: 0,
//                 pages: [event.url],
//                 startTime: event.timestamp
//             };
//         } else {
//             let existingEvent = this.events[this.startTime];
//             existingEvent.pages.push(event.url);
//             existingEvent.duration = event.timestamp - this.startTime;
//         }
//     }
// }

// let users = {};

// for(let event of events) {
//     let user = (users[event.visitorId]) ? users[event.visitorId] : new User();
//     user.addEvent(event);
//     users[event.visitorId] = user;
// }

// let result = {"sessionsByUser": {}};;

// for(let userId in users) {
//     let events = users[userId].events;
//     let sessions = [];
//     for(let eventId in events) {
//         // console.log(events[eventId]);
//         sessions.push(events[eventId]);
//     }
//     result["sessionsByUser"][userId] = sessions;
// }

// console.log(JSON.stringify(result, null, 4));



// function sendResult(sessionsByUser){
    
//     const URL = "https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=ae3dd0c5961f7351181e57c6eabd"
//     const data = {"sessionsByUser":sessionsByUser}
//     console.log(data)
//     fetch(URL, {
//   method: 'POST', 
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })
// .then(response => response.json())
// .then(data => {
//   console.log('Success:', data);
// })
// .catch((error) => {
//   console.error('Error:', error);
// });
// }


