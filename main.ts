import { prisma as db } from './generated/prisma'
import { GraphQLServer } from 'graphql-yoga'
import { PubSub } from 'graphql-yoga'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers: {
        Subscription: {
            newUser: {
                subscribe: (parent, args, ctx) => {
                    return ctx.db.$subscribe.user({ mutation_in: 'CREATED' }).node()
                }
            }
        }
    },
    context: params => ({
        db,
        pubsub,
        ...params
    })
} as any)

server.start(() => console.log('Server is running on localhost:4000'))
