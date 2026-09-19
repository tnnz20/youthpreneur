import { AuthField } from '@/components/auth/auth-field';
import {
  authInputClass,
  authSelectTriggerClass,
  authTextareaClass,
} from '@/components/auth/auth-form';
import { BirthDatePicker } from '@/components/auth/birth-date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { KECAMATAN } from '@/constants/site';

interface RegisterProfileStepProps {
  values: {
    full_name: string;
    nik: string;
    birth_date: string;
    gender: 'male' | 'female' | '';
    district: string;
    phone: string;
    address: string;
    terms: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
}

export function RegisterProfileStep({ values, onChange }: RegisterProfileStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField label="Nama Lengkap" htmlFor="register-name">
          <Input
            id="register-name"
            required
            value={values.full_name}
            onChange={(e) => onChange('full_name', e.target.value)}
            placeholder="Nama sesuai KTP"
            className={authInputClass}
          />
        </AuthField>
        <AuthField label="NIK" htmlFor="register-nik">
          <Input
            id="register-nik"
            required
            value={values.nik}
            onChange={(e) => onChange('nik', e.target.value)}
            placeholder="Nomor Induk Kependudukan"
            className={authInputClass}
          />
        </AuthField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField label="Tanggal Lahir" htmlFor="register-birth-date">
          <BirthDatePicker
            value={values.birth_date}
            onChange={(value) => onChange('birth_date', value)}
          />
        </AuthField>
        <AuthField label="Jenis Kelamin" htmlFor="register-gender">
          <Select
            value={values.gender}
            items={{ male: 'Laki-Laki', female: 'Perempuan' }}
            onValueChange={(value) => onChange('gender', value as 'male' | 'female')}
          >
            <SelectTrigger id="register-gender" className={authSelectTriggerClass}>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Laki-Laki</SelectItem>
              <SelectItem value="female">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </AuthField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField label="Kecamatan" htmlFor="register-district">
          <Select
            value={values.district}
            onValueChange={(value) => onChange('district', value as string)}
          >
            <SelectTrigger id="register-district" className={authSelectTriggerClass}>
              <SelectValue placeholder="Pilih kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {KECAMATAN.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AuthField>
        <AuthField label="Nomor WhatsApp" htmlFor="register-phone">
          <Input
            id="register-phone"
            required
            type="tel"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={authInputClass}
          />
        </AuthField>
      </div>
      <AuthField label="Alamat" htmlFor="register-address">
        <Textarea
          id="register-address"
          required
          value={values.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Alamat lengkap"
          className={authTextareaClass}
        />
      </AuthField>
      <label
        htmlFor="register-terms"
        className="text-brand-dark flex items-start gap-2 text-xs font-medium"
      >
        <Checkbox
          id="register-terms"
          checked={values.terms}
          onCheckedChange={(checked) => onChange('terms', checked === true)}
          className="mt-0.5 cursor-pointer"
        />
        <span>Saya setuju dengan Syarat &amp; Ketentuan program Youthpreneur Tapin.</span>
      </label>
    </div>
  );
}
