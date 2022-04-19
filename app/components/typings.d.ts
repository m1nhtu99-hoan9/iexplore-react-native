import React, { ReactNode } from "react";
import { ColorValue } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";

import { Activity, ActivityDbItem } from "../domain/Activity";


interface ActivityEntityCardItemProps {
  item: ActivityDbItem,
  onMoreBtnPressed: () => void,
  onEditBtnPressed: () => void,
  onDeleteBtnPressed: () => void,
}

interface DbConnectionProviderProps {
  children: React.ReactNode
}

interface ActivityDbServiceProviderProps {
  children: React.ReactNode
}

type FloatingPlusButtonProps = {
  onPressed: () => void
};

type SwipableCardProps = {
  children: ReactNode,
  onMorePressed: () => void,
  onEditPressed: () => void,
  onDeletePressed: () => void,
  hasRightActions: boolean,
};

type RightActionProps = {
  children: ReactNode,
  text?: string,
  colour?: ColorValue,
  x: number,
  onPressed: () => void
} & RectButtonProps;