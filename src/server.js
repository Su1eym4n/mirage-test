// Welcome to the tutorial!
import { createServer, Model, hasMany, belongsTo, RestSerializer, Factory,trait } from "miragejs";

export default function makeSevrer (environment = "development") {
    return createServer({
        environment,
        serializers: {
            reminder: RestSerializer.extend({
                include: ["list"],
                embed: true,
            }),
        },
        models: {
            reminder: Model.extend({
                list: belongsTo()
            }),
            list: Model.extend({
                reminders: hasMany()
            })
        },
        //use factories to easily create data
        factories: {
            reminder: Factory.extend({
                text(i) {
                    return `reminder ${i}`
                }
            }),

            list: Factory.extend({
                name(i) {
                    return `List ${i}`
                },
                withReminders: trait({
                    afterCreate(list, server) {
                      server.createList('reminder', 5, { list })
                    }
                  })
              
            })
        },


        seeds(server) {
            server.create('reminder', { text: 'test' })
            server.createList("reminder", 5);


            server.create("list", {
                name: "Home",
                reminders: [server.create("reminder", { text: "Do taxes" })],
            });

            server.create('list')
        },


        routes() {
            this.get('/api/reminders', (schema) => {
                return schema.reminders.all()
            })

            this.get('/api/lists/:id/reminders', (schema, request) => {
                let listId = request.params.id
                let list = schema.lists.find(listId)
                return list.reminders
            })

            this.get('/api/lists', (schema) => {
                return schema.lists.all()
            })

            this.post('/api/reminders', (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                console.log(attrs)
                return schema.reminders.create(attrs)
            })
            this.delete('api/reminders/:id', (schema, request) => {
                let id = request.params.id
                return schema.reminders.find(id).destroy()

            })
        }
    })
}