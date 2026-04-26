import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;
    app.use(express.json());
    //create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello:String
                say(name:String):String
            }
        `, // schema
        resolvers: {
            Query: {
                hello: () => `hey i am yash!`,
                say: (_, { name }) => `hey ${name} , how are you?`
            }
        }
    });
    //start the gql server
    await gqlServer.start();
    app.get('/', (req, res) => {
        res.json({ message: "server is up and running" });
    });
    app.use('/graphql', expressMiddleware(gqlServer));
    app.listen(PORT, () => {
        console.log('server started at , ', PORT);
    });
}
init();
//# sourceMappingURL=index.js.map