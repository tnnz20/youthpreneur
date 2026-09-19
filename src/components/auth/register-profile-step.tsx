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

const inputClass =
  'text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 sm:text-sm';

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
        <Field label="Nama Lengkap" htmlFor="register-name">
          <Input
            id="register-name"
            required
            value={values.full_name}
            onChange={(e) => onChange('full_name', e.target.value)}
            placeholder="Nama sesuai KTP"
            className={inputClass}
          />
        </Field>
        <Field label="NIK" htmlFor="register-nik">
          <Input
            id="register-nik"
            required
            value={values.nik}
            onChange={(e) => onChange('nik', e.target.value)}
            placeholder="Nomor Induk Kependudukan"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tanggal Lahir" htmlFor="register-birth-date">
          <BirthDatePicker
            value={values.birth_date}
            onChange={(value) => onChange('birth_date', value)}
          />
        </Field>
        <Field label="Jenis Kelamin" htmlFor="register-gender">
          <Select
            value={values.gender}
            items={{ male: 'Laki-Laki', female: 'Perempuan' }}
            onValueChange={(value) => onChange('gender', value as 'male' | 'female')}
          >
            <SelectTrigger id="register-gender" className={inputClass}>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Laki-Laki</SelectItem>
              <SelectItem value="female">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kecamatan" htmlFor="register-district">
          <Select
            value={values.district}
            onValueChange={(value) => onChange('district', value as string)}
          >
            <SelectTrigger id="register-district" className={inputClass}>
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
        </Field>
        <Field label="Nomor WhatsApp" htmlFor="register-phone">
          <Input
            id="register-phone"
            required
            type="tel"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Alamat" htmlFor="register-address">
        <Textarea
          id="register-address"
          required
          value={values.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Alamat lengkap"
          className="text-brand-dark focus-visible:border-brand-dark min-h-24 rounded-xl border border-black/30 bg-white text-base focus-visible:ring-0 sm:text-sm"
        />
      </Field>
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

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-brand-dark mb-1 block text-xs font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}
