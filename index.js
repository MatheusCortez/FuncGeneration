import axios from "axios"


async function processDBData(){
    console.time('Normal')
    const {data} = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=50') // lista de agendamentos do csv
    const {results:pokemonList } = data

    const fires=[]
    const poison =[]
    const others =[]
    for(const pokenon  of pokemonList){
        const {data:pokemonInfo } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokenon.name}`) // busca de agendamento por ID
        const {types } = pokemonInfo
        types.map(item=>{
            const {type} = item
            const {name}= type
            if(name==='fire'){
                return fires.push({name:pokemonInfo.name,types:pokemonInfo.types})
            }
            if(name==='poison'){
                return poison.push({name:pokemonInfo.name,types:pokemonInfo.types})
            }
            return others.push({name:pokemonInfo.name,types:pokemonInfo.types})

        })
    }
    console.timeEnd('Normal')
    return {
        fires,
        poison,
        others
    }

}



async function* processDBDataGen(){
    console.time('Gen')
    const {data} = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=10') // lista de agendamentos do csv
    const {results:pokemonList } = data

    for(const pokenon  of pokemonList){
        const {data:pokemonInfo } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokenon.name}`) // busca de agendamento por ID
        // const {data:cartInfo } = await axios.post(`${CART_URL}`,pokemonInfo)
        yield pokemonInfo
    }

}


const firesGen =[]
const poisonGen =[]
const othersGen =[]
for await(const pokemon of processDBDataGen() ){
    const {types } = pokemon
    types.map(item=>{
        const {type} = item
        const {name}= type
        if(name==='fire'){
            return firesGen.push({name:pokemon.name,types:pokemon.types})
        }
        if(name==='poison'){
            return poisonGen.push({name:pokemon.name,types:pokemon.types})
        }

        return othersGen.push({name:pokemon.name,types:pokemon.types})

    })



}
console.timeEnd('Gen')

await processDBData()
