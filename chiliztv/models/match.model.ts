// Types d'odds étendus
export interface ExtendedOdds {
    // Match Winner (1X2)
    match_winner?: {
        home: number;
        draw: number;
        away: number;
    };
    
    // Over/Under Goals
    over_under?: {
        over_0_5: number;
        over_1_5: number;
        over_2_5: number;
        over_3_5: number;
        over_4_5: number;
        under_0_5: number;
        under_1_5: number;
        under_2_5: number;
        under_3_5: number;
        under_4_5: number;
    };
    
    // Both Teams Score
    both_teams_score?: {
        yes: number;
        no: number;
    };
    
    // Double Chance
    double_chance?: {
        home_or_draw: number;
        home_or_away: number;
        draw_or_away: number;
    };
    
    // Draw No Bet
    draw_no_bet?: {
        home: number;
        away: number;
    };
    
    // First Half Winner
    first_half_winner?: {
        home: number;
        draw: number;
        away: number;
    };
    
    // First Half Goals
    first_half_goals?: {
        over_0_5: number;
        over_1_5: number;
        under_0_5: number;
        under_1_5: number;
    };
    
    // Half Time/Full Time
    ht_ft?: {
        home_home: number;
        home_draw: number;
        home_away: number;
        draw_home: number;
        draw_draw: number;
        draw_away: number;
        away_home: number;
        away_draw: number;
        away_away: number;
    };
    
    // Correct Score
    correct_score?: {
        [key: string]: number; // "1-0", "2-1", etc.
    };
    
    // Exact Goals Number
    exact_goals_number?: {
        [key: string]: number; // "0", "1", "2", etc.
    };
    
    // Goalscorers (First Goalscorer)
    goalscorers?: {
        [playerName: string]: number;
    };
    
    // Clean Sheet
    clean_sheet?: {
        home_yes: number;
        home_no: number;
        away_yes: number;
        away_no: number;
    };
    
    // Win to Nil
    win_to_nil?: {
        home_yes: number;
        home_no: number;
        away_yes: number;
        away_no: number;
    };
    
    // Highest Scoring Half
    highest_scoring_half?: {
        first_half: number;
        second_half: number;
        equal: number;
    };
    
    // Odd/Even Goals
    odd_even_goals?: {
        odd: number;
        even: number;
    };
    
    // First Half Goals Odd/Even
    first_half_odd_even?: {
        odd: number;
        even: number;
    };
}

export interface IMatch {
    id: number;
    api_football_id: number;
    home_team: string;
    away_team: string;
    home_score: number | null;
    away_score: number | null;
    match_date: string;
    status: string;
    league: string;
    season: string;
    venue: string | null;
    referee: string | null;
    odds: ExtendedOdds;
}

export type IMatchId = IMatch & { id: number };
