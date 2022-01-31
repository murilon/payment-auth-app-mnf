import React, { Component, Fragment } from 'react'
import styles from './index.css'

class ExampleTransactionAuthApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scriptLoaded: false,
      loading: false,
    }

    this.divContainer = React.createRef()
  }

  componentWillMount = () => {
    this.injectScript(
      'google-recaptcha-v2',
      'https://recaptcha.net/recaptcha/api.js?render=explicit',
      this.handleOnLoad
    )
  }

  componentDidMount() {
    // In case you want to remove payment loading in order to show an UI.
    $(window).trigger('removePaymentLoading.vtex')
  }

  respondTransaction = status => {
    $(window).trigger('transactionValidation.vtex', [status])
  }

  handleOnLoad = () => {
    this.setState({ scriptLoaded: true })
    grecaptcha.ready(() => {
      grecaptcha.render(this.divContainer.current, {
        sitekey: '6Lel9UweAAAAAB-IZKhzE48Cd6CVIB1Zd461dyjv', //Replace with site key
        theme: 'dark',
        callback: this.onVerify,
      })
    })
  }

  onVerify = e => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.approvePaymentUrl).then(() => {
      this.respondTransaction(true)
    })
  }

  cancelTransaction = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.denyPaymentUrl).then(() => {
      this.respondTransaction(false)
    })
  }

  //Log da informação parseada no payLoad
  getParsedPayload = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    console.log(parsedPayload)
  }

  confirmTransation = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.approvePaymentUrl).then(() => {
      this.respondTransaction(true)
    })
  }

  injectScript = (id, src, onLoad) => {
    if (document.getElementById(id)) {
      return
    }

    const head = document.getElementsByTagName('head')[0]

    const js = document.createElement('script')
    js.id = id
    js.src = src
    js.async = true
    js.defer = true
    js.onload = onLoad

    head.appendChild(js)
  }

  render() {
    const { scriptLoaded, loading } = this.state

    return (
      <div className={styles.wrapper}>
        {scriptLoaded && !loading ? (
          <Fragment>
            <div className="QR">
              <img src="https://murilofaria.vteximg.com.br/arquivos/frame.png"></img>
            </div>
            <div className="g-recaptcha" ref={this.divContainer}></div>
            <button
              id="payment-app-confirm"
              className={styles.buttonSuccess}
              onClick={this.confirmTransation}>
              Confirmar
            </button>
          </Fragment>
        ) : (
          <h2>Carregando...</h2>
        )}

        {!loading && (
          <><button
            id="payment-app-cancel"
            className={styles.buttonDanger}
            onClick={this.cancelTransaction}>
            Cancelar
          </button>

            <button
              id="payment-app-parsed"
              className={styles.button}
              onClick={this.getParsedPayload}>
              Parsed Info
            </button></>


        )}
      </div>
    )
  }
}

export default ExampleTransactionAuthApp
