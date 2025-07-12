import { ApiService } from "./api.service";
import { IMatch, IMatchId } from "@/models/match.model";
import axios from 'axios';
import { ServiceResult } from "./service.result";

export class MatchService {

    static async getAllMatches(): Promise<ServiceResult<IMatchId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getMatchById(id: number): Promise<ServiceResult<IMatch>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/${id}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getLiveMatches(): Promise<ServiceResult<IMatchId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/live`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getUpcomingMatches(): Promise<ServiceResult<IMatchId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/upcoming`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getMatchesByLeague(league: string): Promise<ServiceResult<IMatchId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/league/${league}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getMatchesInNext24Hours(): Promise<ServiceResult<IMatchId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/next-24h`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getMatchesByDateRange(startDate: string, endDate: string): Promise<ServiceResult<IMatchId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/date-range`, {
                params: {
                    startDate,
                    endDate
                }
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

    static async syncMatchesFromApi(): Promise<ServiceResult<void>> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/matches/sync`);
            if (res.status === 200) {
                return ServiceResult.success(undefined);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getCacheStats(): Promise<ServiceResult<any>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/matches/cache/stats`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }
}