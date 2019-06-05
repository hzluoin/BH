import Http from './http'
import Limit from './limit'

let Filter = {
  filter () {
    Http.filter()
    Limit.filter()
  }
}
export default Filter
