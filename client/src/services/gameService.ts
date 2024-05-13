import axios from "@/middleware/axios";

const GameService = {
    async fetchCurrentGame(roomId : any){
        return axios.get(`/games/currentGame/${roomId}`)
            .then((res : any) => res.data.game)
            .catch((error : any) => {
                console.error("Error", error);
                throw error;
            })
    },

    async updateTurnRound(roomId : any) {
        return axios.put('/games/newRound', {roomId})
            .then((res : any) => res.data.game)
            .catch((error : any) => {
                console.error("Error", error);
                throw error;
            })
    }
};

export default GameService;
