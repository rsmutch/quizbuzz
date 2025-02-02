import { firebase } from '../../src/firebaseConfig';

const gamesRef = firebase.firestore().collection('games');

const generateRoomCode = () => {
  let result = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const joinRoom = (navigation, currentUser, roomCode) => {
  const regex = /[A-Z]{4}/g;

  if (!regex.test(roomCode)) {
    alert('Room code should be 4 letters long!');
  } else {
    gamesRef
      .where('roomCode', '==', roomCode)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(function (doc) {
            const gameId = doc.id;

            if (doc.exists) {
              gamesRef
                .doc(gameId)
                .collection('users')
                .doc(currentUser.id)
                .set({
                  ...currentUser,
                  score: 0,
                  team: null
                });
              navigation.navigate('WaitingRoom', {
                currentUser,
                gameId,
                roomCode
              });
            } else {
              alert('Room does not exist!');
            }
          });
        } else {
          alert('Room does not exist!');
        }
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }
};

export const createRoom = (navigation, currentUser) => {
  const roomCode = generateRoomCode();
  gamesRef
    .add({
      buzzed: null,
      roomCode,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      gameIsActive: false,
      quizMaster: { username: currentUser.username, id: currentUser.id },

      host: { username: currentUser.username, id: currentUser.id }
    })
    .then((docRef) => {
      addHost(navigation, currentUser, docRef.id, roomCode);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const addHost = (navigation, currentUser, gameId, roomCode) => {
  gamesRef
    .doc(gameId)
    .collection('users')
    .doc(currentUser.id)
    .set({
      ...currentUser,
      score: 0,
      team: null
    });
  navigation.navigate('WaitingRoom', {
    currentUser,
    gameId,
    roomCode
  });
};
