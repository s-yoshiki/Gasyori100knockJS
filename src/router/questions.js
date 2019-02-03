// import ans1 from '@/components/questions/0/ans1'
// import ans2 from '@/components/questions/0/ans2'

import ItemComponent from '@/components/questions/component.js'
import ans1 from '@/components/questions/answers/ans1.vue'


const branch = "/questions/" 
let exportRoutes = []

for (let key in ItemComponent) {
    exportRoutes.push(
        {path: branch + key , name: key, component: ItemComponent[key]}
    )
}

export default exportRoutes

// export default [
//     {path: branch + 'test' , name: 'ans1', component: ans1},
//     {path: branch + '1' , name: 'ans1', component: ItemComponent['ans1']},
//     {path: branch + '2' , name: 'ans2', component: ItemComponent['ans2']},
// ]