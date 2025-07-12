import { ApiService } from "./api.service";
import axios from 'axios';
import { ServiceResult } from "./service.result";
import { ChatMessage, BetMessage } from "@/models/chat.model";

export class ChatService {

    static async joinRoom(matchId: number, userId: string, username: string): Promise<ServiceResult<any>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/chat/join/${matchId}`, {
                userId,
                username
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async leaveRoom(matchId: number, userId: string, username: string): Promise<ServiceResult<any>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/chat/leave/${matchId}`, {
                userId,
                username
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async sendMessage(matchId: number, userId: string, username: string, message: string, walletAddress: string): Promise<ServiceResult<ChatMessage>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/chat/message/${matchId}`, {
                userId,
                username,
                message,
                walletAddress
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async sendBetMessage(
        matchId: number, 
        userId: string, 
        username: string, 
        betType: string, 
        betSubType: string, 
        amount: number, 
        odds: number,
        walletAddress: string
    ): Promise<ServiceResult<BetMessage>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/chat/bet/${matchId}`, {
                userId,
                username,
                betType,
                betSubType,
                amount,
                odds,
                walletAddress
            });
            if (res.status === 200) {
                return ServiceResult.success(res.data.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getRoomMessages(matchId: number): Promise<ServiceResult<ChatMessage[]>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/chat/messages/${matchId}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data.messages);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getConnectedUsers(matchId: number): Promise<ServiceResult<string[]>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/chat/users/${matchId}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data.users);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getChatStats(): Promise<ServiceResult<any>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/chat/stats`);
            if (res.status === 200) {
                return ServiceResult.success(res.data.stats);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getGunWebSocket(): Promise<ServiceResult<any>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/chat/gun`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getUserTokenBalances(walletAddress: string): Promise<ServiceResult<any>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/chat/token-balances/${walletAddress}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data.balances);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }
}
