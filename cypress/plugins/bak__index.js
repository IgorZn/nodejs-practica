const User = require('../../models/user')
const MongoClient = require('mongodb').MongoClient
const keys = require('../../keys')



module.exports = (on, config) => {
    on('task', {
            async getUserToken ({ username }) {
                await mongoose.connect(keys.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                })
                const user = await User.findOne({email: username})
                console.log(username)
                console.log(user)
                const token = user.resetToken

                return token;
            },

            deleteUser(id) {
              return new Promise((resolve) => {
                MongoClient.connect(MONGODB_URI, (err, client) => {
                  if (err) {
                    console.log(`MONGO CONNECTION ERROR: ${err}`)
                    throw err;
                  } else {
                    client.collection('users').count({}, function(error, numOfDocs){
                      resolve({success: numOfDocs})
                      client.close();
                    })
                  }
                });
              }); // end of return Promise
            },

            logIn({username, password}) {
                // Capture HTTP requests.
                cy.server();
                cy.route({
                    method: 'POST',
                    url: '**/api/log_in/**',
                    status: 200,
                    response: {
                        'access': 'ACCESS_TOKEN',
                        'refresh': 'REFRESH_TOKEN'
                    }
                }).as('logIn');

                // Log into the app.
                cy.visit('/auth/login#login');
                cy.get('input#email').type(username, {force: true});
                cy.get('input#password').type(password, { log: false, force: true});
                cy.get('button').contains('Войти').click();

                return cy.get('.container')
            }



        });
}
