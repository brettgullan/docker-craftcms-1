
import React from 'react'
import ReactHabitat from 'react-habitat'

// ----------------------------------------------------------------------------

const Title = () => (<h1>Hello World</h1>)

// ----------------------------------------------------------------------------

class MyApp extends ReactHabitat.Bootstrapper {
  constructor() {
    super()

    const builder = new ReactHabitat.ContainerBuilder()
    builder.register(Title).as('MyApp')
    this.setContainer(builder.build())
  }
}

// ----------------------------------------------------------------------------

const myApp = new MyApp()

export default myApp

// ----------------------------------------------------------------------------

module.hot.accept(['./index.js'], () => {
  console.log('Updating ...')
})
