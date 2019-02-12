import ItemComponent from '@/components/questions/component.js'

const branch = "/questions/" 
// const branch = "" 
let exportRoutes = []

for (let key in ItemComponent) {
    exportRoutes.push(
        {path: branch + key , name: key, component: ItemComponent[key]}
    )
}

export default exportRoutes
