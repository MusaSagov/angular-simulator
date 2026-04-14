import { FormControl, FormGroup } from '@angular/forms';

interface AddressFormControls {
  city: FormControl<string | null>;
  street: FormControl<string | null>;
  suite: FormControl<string | null>;
  zipcode: FormControl<string | null>;
  geo: FormGroup<{
    lat: FormControl<string | null>;
    lng: FormControl<string | null>;
  }>;
}

interface CompanyFormControls {
  name: FormControl<string | null>;
  catchPhrase: FormControl<string | null>;
  bs: FormControl<string | null>;
}

export interface UserFormControls {
  name: FormControl<string | null>;
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  website: FormControl<string | null>;
  address: FormGroup<AddressFormControls>;
  company: FormGroup<CompanyFormControls>;
}