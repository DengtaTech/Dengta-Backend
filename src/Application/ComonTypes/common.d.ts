// 將物件中所有函數屬性刪除
type Property<T> = Pick<T, {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]>;

// map each type of keys of SrcObject to type Target
type KeyToType<SrcObject, Target> = {
  [U in keyof SrcObject]: Target
}

declare namespace Dengta {
  type oError = {
    error: string;
  };
}
