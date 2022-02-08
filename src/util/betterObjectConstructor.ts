export declare interface BetterObjectConstructor extends ObjectConstructor {
  fromEntries<T, U extends string>(
    entries: Iterable<readonly [U, T]>
  ): { [P in U]: T };
}
