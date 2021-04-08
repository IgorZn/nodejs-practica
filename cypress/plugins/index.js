/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const User = require('../../models/user')
const mongoose = require('mongoose')
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



        });
}
