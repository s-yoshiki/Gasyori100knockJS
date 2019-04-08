import ItemComponent from '@/components/questions/component.js'
import description from '@/components/questions/description.js'

const branch = "/questions/"
let exportRoutes = []

for (let key in ItemComponent) {
  exportRoutes.push(
    {
      path: branch + key + "/iframe",
      name: key + "_iframe",
      title: description[key] ? description[key].title : '',
      desc: description[key] ? description[key].desc : '',
      component: ItemComponent[key]
    }
  )
}
export default exportRoutes