export class ListEvent {
    when ? : WhenEventFilter = WhenEventFilter.All
    page: number = 1;
}

export enum WhenEventFilter {
    All = 1,
        Today,
        Tommorow,
        ThisWeek,
        NextWeek
}