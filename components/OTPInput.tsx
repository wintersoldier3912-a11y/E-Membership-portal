
import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete, disabled }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(val => val !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(data)) return;

    const newOtp = data.split('');
    const paddedOtp = [...newOtp, ...new Array(length - newOtp.length).fill('')];
    setOtp(paddedOtp);
    
    if (newOtp.length === length) {
      onComplete(data);
    }
  };

  return (
    <div className="flex gap-2 justify-between">
      {otp.map((data, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all disabled:bg-gray-100"
        />
      ))}
    </div>
  );
};
