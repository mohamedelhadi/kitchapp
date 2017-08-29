export interface Common {
    Done: string;
    Ok: string;
    Save: string;
    Update: string;
    Exit: string;
    Close: string;
    Dismiss: string;
    Cancel: string;
    Write: string;
    Search: string;
    Edit: string;
    Delete: string;
    Sorry: string;
    Error: string;
    Abort: string;
    Ignore: string;
    SignOut: string;
    Pound: string;
    Submit: string;
    Navigate: string;
    Send: string;
    TypeHere: string;
    No: string;
    Login: string;
}

export interface Messages {
    LoadingPosition: string;
    NoMatch: string;
    NoDeals: string;
    NoPhones: string;
    SelectBranch: string;
    HavenotSetFavorites: string;
    LoggingIn: string;
    ForgotToEnterFeedback: string;
    YouNeedToLoginInOrderToRate: string;
}

export interface Errors {
    Unknown: string;
    Offline: string;
    GeolocationPositionError: string;
    LoginFailure: string;
}

export interface ServerErrors {
    AlreadyRatedBranch: string;
    AlreadyRatedItem: string;
}

export interface Languages {
    0: string;
    1: string;
}

export interface Home {
    Restaurants: string;
    Favorites: string;
    Cuisines: string;
    Deals: string;
}

export interface Restaurants {
    Order: string;
    AtoZ: string;
    Nearby: string;
    TopRated: string;
    Filter: string;
    City: string;
    Cuisine: string;
    SearchPlaceholder: string;
}

export interface Tabs {
    Menu: string;
    Branches: string;
    Deals: string;
}

export interface Restaurant {
    Bio: string;
    Quality: string;
    Service: string;
    Place: string;
    Price: string;
    Phones: string;
    Branch: string;
    BranchesSelectPlaceholder: string;
    CommentPlaceholder: string;
    SearchPlaceholder: string;
    FeedbackToManagement: string;
}

export interface Deal {
    Deal: string;
}

export interface ITranslationKeys {
    Common: Common;
    Messages: Messages;
    Errors: Errors;
    ServerErrors: ServerErrors;
    Languages: Languages;
    Home: Home;
    Restaurants: Restaurants;
    Tabs: Tabs;
    Restaurant: Restaurant;
    Deal: Deal;
}