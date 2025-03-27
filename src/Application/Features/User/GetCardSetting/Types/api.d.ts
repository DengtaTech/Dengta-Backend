declare namespace GetCardSetting {
  type IGetCardSettingRes = {
    data: {
      latest: boolean;
      footprintId: string | null;
      cardURL: string;
    };
  };
}
