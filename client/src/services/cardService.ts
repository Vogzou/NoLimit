import axios from "@/middleware/axios";

const CardService = {
    async fetchCardsPlayer(cardIds : number[]) {
        return axios.get(`/cards/playerCards`, {params : cardIds})
            .then((res : any) => res.data.cards)
            .catch((error : any) => {
                console.error("Error", error);
                throw error;
            })
    }
};

export default CardService;
