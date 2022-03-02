import instance from '../instance'

const getCurrencies = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/currencies/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getIncoterm = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/incoterms/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getTransport = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/transport/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getOriginDestination = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/origins/destinations/resumo')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const newProposal = {
  getCurrencies,
  getIncoterm,
  getTransport,
  getOriginDestination
}

export default newProposal
