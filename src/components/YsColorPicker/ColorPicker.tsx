// components/ColorPicker.tsx
import React from "react";
import { Input } from "antd";

interface ColorPickerProps {
    value?: string;
    onChange?: (val: string) => void;
    disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value = "#000000", onChange, disabled }) => {
    return (
        <div className="flex gap-2">
            <input
                type="color"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className="h-9 w-9 p-0 border-0 cursor-pointer"
            />
            <Input
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                style={{ flex: 1 }}
            />
        </div>
    );
};
export default ColorPicker;