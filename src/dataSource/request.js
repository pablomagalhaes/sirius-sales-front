import request from 'superagent'
import {
  API_URL,
  INVALID_ACCESS_TOKEN_ERROR_CODE,
  AUTH_URL
} from '../utils/constants'
import {
  getAccessToken,
  removeUserFromStorage,
  getRefreshToken,
  getAlwaysLogged,
  setUserOnStorage
} from '../utils/users'
import { notification } from 'antd'

const notificationError = (props, isWarning) => {
  let message = props.body && props.body.message ? props.body.message : ''
  const status = props.status ? props.status : 0
  const windowPath = window.location.pathname

  if (status === 404 ||
    (status === 400 && windowPath.includes('/user/register'))) {
    return notification.warning({
      message: 'Alerta',
      description: message
    })
  }

  const data = props.data
  // Trata mensagens de erro em responses do tipo Blob
  if (data instanceof Blob) {
    let resData = null
    try {
      const resTextQ = new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('abort', reject)
        reader.addEventListener('error', reject)
        reader.addEventListener('loadend', () => {
          resolve(reader.result)
        })
        reader.readAsText(data)
      })
      resTextQ.then((resText) => {
        resData = JSON.parse(resText)
        message = resData.message
        notification[(isWarning || status === 422) ? 'warning' : 'error']({
          message: (isWarning || status === 422) ? 'Alerta' : `Error: ${status}`,
          description: `${message || 'Erro'}`
        })
      })
    } catch (err) {
      // nada a fazer
    }
  } else {
    const getNotificationType = () => {
      if (status === 422) {
        return 'warning'
      } else {
        return 'error'
      }
    }

    notification[getNotificationType()]({
      message: (status !== 422) ? `Error: ${status}` : `Alerta: ${status}`,
      description: `${message || 'Erro'}`
    })
  }
}

export function notificationErrorFn (response) { notificationError(response) }

export function notificationWarningFn (response) { notificationError(response, true) }

const notificationSucess = (message) => {
  notification.success({
    message: `${message || 'Sucesso'}`
  })
}

const validateResponse = (response) => {
  if (response) {
    const { error, body, 'body.error.bodyError': bodyError } = response

    if (body && bodyError === INVALID_ACCESS_TOKEN_ERROR_CODE) {
      const test = getAlwaysLogged()
      if (test === 'true') {
        refreshAuthenticate().then((response) => {
          setUserOnStorage(response)
          return window.location.reload()
        })
      } else {
        removeUserFromStorage()
        notificationError(response)
        return (window.location.href = '/login')
      }
    }
    if (error) {
      if (response.status === 401) {
        removeUserFromStorage()
        return (window.location.href = '/login')
      } else {
        notificationError(response)
      }
    }
  }
}

export function getComplete ({ url, params }) {
  return new Promise((resolve, reject) =>
    request
      .get(API_URL + url)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .query(params)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          reject(response)
        }
        if (response) {
          resolve(response)
        }
      })
  )
}

export function getReactQuery ({ url, params }) {
  return request
    .get(API_URL + url)
    .set('Authorization', `Bearer ${getAccessToken()}`)
    .query(params)
    .then((response) => {
      if (response.error) {
        validateResponse(response)
      }
      return response.body
    })
}

export function get ({ url, params }) {
  return new Promise((resolve, reject) =>
    request
      .get(API_URL + url)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .query(params)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          reject(response)
        }
        if (response) {
          resolve(response.body)
        }
      })
  )
}

export function getWithoutAuthentication ({ url, params }) {
  return new Promise((resolve, reject) =>
    request
      .get(API_URL + url)
      .query(params)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          reject(response)
        }
        if (response) {
          resolve(response.body)
        }
      })
  )
}

export function getWithoutMessage ({ url, params }) {
  return new Promise((resolve) =>
    request
      .get(API_URL + url)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .query(params)
      .end(async (error, response) => { // eslint-disable-line
        if (response) {
          resolve(response.body)
        }
      })
  )
}

export function getApropriationShipment () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/apropriationShipment')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getJsonServer () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/acceptedShipment')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getManagementShipment () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/managementShipment')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getMap () {
  return new Promise((resolve, reject) =>
    request.get('http://localhost:3000/map').end(async (error, response) => {
      if (response) {
        resolve(response.body)
      }
      if (error) {
        reject(error)
      }
    })
  )
}

export function getProgress () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/progress')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getTransporter () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/transporter')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getTypeShipment () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/typeShipment')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getDriver (params) {
  const query =
    params && params.name !== 'undefined' ? `?name=${params.name}` : ''
  return new Promise((resolve, reject) =>
    request
      .get(`http://localhost:3000/driver${query}`)
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function patchApropriationShipment (params) {
  return new Promise((resolve, reject) =>
    request
      .patch(`http://localhost:3000/apropriationShipment/${params.id}`)
      .send(params)
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function patchManagementShipment (params) {
  return new Promise((resolve, reject) =>
    request
      .patch(`http://localhost:3000/managementShipment/${params.id}`)
      .send(params)
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getTracking (params) {
  return new Promise((resolve, reject) =>
    request
      .get(`http://localhost:3000/tracking${params ? '?' + params : ''}`)
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getShipments () {
  return new Promise((resolve, reject) =>
    request
      .get('http://localhost:3000/shipment')
      .end(async (error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function getById ({ url, id }) {
  return new Promise((resolve) =>
    request
      .get(API_URL + url + id)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .end(async (error, response) => {
        if (error) return validateResponse(response)
        if (response) {
          notificationSucess()
          resolve(response.body)
        }
      })
  )
}

export function postLocation ({ url, params, message }) {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + url)
      .send(params)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .type('application/json')
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response)
        }
      })
  )
}

export function postReactQuery ({ url, params, message }) {
  return request
    .post(API_URL + url)
    .send(params)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${getAccessToken()}`)
    .type('application/json')
}

export function post ({ url, params, message }) {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + url)
      .send(params)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .type('application/json')
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
      })
  )
}

export function postWithoutMessage ({ url, params, message }) {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + url)
      .send(params)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .type('application/json')
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          resolve(response.body)
        }
      })
  )
}

export function postFile ({ url, formData, message }) {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + url)
      .send(formData)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
      })
  )
}

export function putFile ({ url, formData, message }) {
  return new Promise((resolve, reject) =>
    request
      .put(API_URL + url)
      .send(formData)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
      })
  )
}

export function putFileWithoutAuthentication ({ url, formData, message }) {
  return new Promise((resolve, reject) =>
    request
      .put(API_URL + url)
      .send(formData)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
      })
  )
}

export function putReactQuery ({ url, params, message }) {
  return request
    .put(API_URL + url)
    .send(params)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${getAccessToken()}`)
    .type('application/json')
}

export function put ({ url, params, message }) {
  return new Promise((resolve, reject) =>
    request
      .put(API_URL + url)
      .send(params)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .type('application/json')
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
      })
  )
}

export function patchFile ({ url, formData, message }) {
  return new Promise((resolve, reject) =>
    request
      .patch(API_URL + url)
      .send(formData)
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
      })
  )
}

export function patch ({ url, params, id, message }) {
  const urlFull = API_URL + url + (id || '')

  return new Promise((resolve, reject) =>
    request
      .patch(urlFull)
      .send(params)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .type('application/json')
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          return resolve(response.body)
        }
      })
  )
}

export function del ({ url, params, message }) {
  return new Promise((resolve, reject) =>
    request
      .delete(API_URL + url)
      .send(params)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .type('application/json')
      .end(async (error, response) => {
        if (error) {
          validateResponse(response)
          return reject(error)
        }
        if (response) {
          notificationSucess(message)
          resolve(response.body)
        }
        resolve('')
      })
  )
}

export function refreshAuthenticate () {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + AUTH_URL)
      .set('Authorization', 'Basic ZnRhX2NvbnRyb2w6ZnRhX2NvbnRyb2w=')
      .field('grant_type', 'refresh_token')
      .field('refresh_token', getRefreshToken())
      .end((error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (error) {
          reject(error)
        }
      })
  )
}

export function userAuthenticate ({ url, params }) {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + url)
      .set('Authorization', 'Basic ZnRhX2NvbnRyb2w6ZnRhX2NvbnRyb2w=')
      .field('username', params.email)
      .field('password', params.password)
      .field('grant_type', 'password')
      .end((error, response) => {
        if (response) {
          resolve(response.body)
        } else {
          reject(error)
        }
      })
  )
}

export function userSignUp ({ url, params }) {
  return new Promise((resolve, reject) =>
    request
      .post(API_URL + url)
      .send(params)
      .set('Content-Type', 'application/json')
      .type('application/json')
      .end((error, response) => {
        if (response) {
          resolve(response.body)
        }
        if (response.body && response.body.error) {
          notificationError(response)
        } else {
          reject(error)
        }
      })
  )
}
