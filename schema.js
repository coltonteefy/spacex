const axios = require('axios');
const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLList, GraphQLSchema} = require('graphql');

// -----------------LAUNCHES---------------------
//launch type
const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: {type: GraphQLInt},
        mission_name: {type: GraphQLString},
        launch_year: {type: GraphQLString},
        launch_date_local: {type: GraphQLString},
        launch_success: {type: GraphQLBoolean},
        links: {type: Links}
    })
});

//youtube link
const Links = new GraphQLObjectType({
    name: 'Links',
    fields: () => ({
        video_link: {type: GraphQLString},
        youtube_id: {type: GraphQLString},
    })
});

//Next Launch Date
const NextLaunch = new GraphQLObjectType({
    name: 'NextLaunch',
    fields: () => ({
        launch_date_utc: {type: GraphQLString},
        mission_name: {type: GraphQLString},
    })
});


// -----------------ROCKETS---------------------
//Rocket type
const RocketType = new GraphQLObjectType({
    name: 'Rockets',
    fields: () => ({
        id: {type: GraphQLString},
        cost_per_launch: {type: GraphQLInt},
        height: {type: RocketHeight},
        mass: {type: RocketMass},
        description: {type: GraphQLString},
        rocket_name: {type: GraphQLString},
        rocket_id: {type: GraphQLString},
    })
});

//Height
const RocketHeight = new GraphQLObjectType({
    name: 'RocketHeight',
    fields: () => ({
        meters: {type: GraphQLFloat},
        feet: {type: GraphQLFloat},
    })
});

//Mass
const RocketMass = new GraphQLObjectType({
    name: 'RocketMass',
    fields: () => ({
        kg: {type: GraphQLInt},
        lb: {type: GraphQLInt},
    })
});


//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/launches')
                    .then(res => res.data);
            }
        },
        launch: {
            type: LaunchType,
            args: {
                flight_number: {type: GraphQLInt}
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                    .then(res => res.data);
            }
        },
        nextLaunch: {
            type: NextLaunch,
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/launches/next')
                    .then(res => res.data);
            }
        },
        rockets: {
            type: new GraphQLList(RocketType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/rockets')
                    .then(res => res.data);
            }
        },
        rocket: {
            type: RocketType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
                    .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
