import axios from "@/middleware/axios";

const PlayerService = {
    async fetchPlayers(roomId : any){
        return axios.get(`/users/${roomId}`)
            .then((res : any) => res.data.players)
            .catch((error : any) => {
                console.error("Error", error);
                throw error;
            })
    },
    async fetchCurrentPlayer(socketId : string){
        return axios.get(`/users/currentUser/${socketId}`)
            .then((res : {data : any}) => res.data.currentPlayer)
            .catch((error : any) => {
                console.error("Error", error);
                throw error;
            });
    }
};
export default PlayerService;
