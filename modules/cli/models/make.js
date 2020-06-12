export default ({ args, cwd, fs }) => {
  let filePath = `${cwd}/models/${args[0].toLowerCase()}.js`

  const template = `import { Model } from '@phpixel/node-eloquent'

export default class ${args[0]} extends Model {

}
`
  /*
    check if models folder exists
  */
  try {
    fs.accessSync(`${cwd}/models`, fs.F_OK)
  } catch (e) {
    fs.mkdirSync(`${cwd}/models`)
  }

  fs.writeFile(filePath, template, err => {
    if (err) throw err;
  })

  console.log('Created model: ', filePath)
}
