const db = require('./models')

// db.chat.create({
//   toUser: 5,
//   fromUser: 4,
// })
// .then(comment => {
//   console.log(comment.get())
// })


db.chat.findOrCreate({
    where: {
        toUser: 5,
        fromUser: 4,
    }
  }).then(([chat, created]) => {
    // Second, get a reference to a toy.
    db.user.findOrCreate({
      where: {id: 4}
    }).then(([user, created]) => {
      // Finally, use the "addModel" method to attach one model to another model.
      chat.addUser(user).then(relationInfo => {
        console.log(`added to ${user.firstName}.`);
      });
    });
  });