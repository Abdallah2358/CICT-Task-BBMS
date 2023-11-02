# Adding a new resource to the project 

## Creating model and migration
- start by `cd ./database`
- then the following command but replace the parts between `<>` with your resource details
```
npx sequelize-cli model:generate --name <model name> --attributes <attribute_1_name>:<attribute_1_type>,<attribute_1_name>:<attribute_2_type>
```
- Notes :
  - Your Model name needs to be single 
  - it is best practice to name your model in Pascal Case

## Creating Controller 
- create a new file at `./controllers`
- your controller name should be Pascal Case
- it should be `<model name>Controller.js` 
- please follow restful api best practice like `./controllers/TemplateController.js`

## Create Router 
- - create a new file at `./routers`
- your router name should be lower case 
- please follow restful best practices like template `./routes/template.js`
- import your controller and start using it
- if you you want to add validation there will be another document on this topic
## Create Views
- create a new file at `./views` 
- the file name should be  the action that renders it  