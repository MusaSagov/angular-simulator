export interface UserFormData {
  name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: {
    city: string | null;
    street: string | null;
    suite: string | null;
    zipcode: string | null;
    geo: {
      lat: string | null;
      lng: string | null;
    };
  } | null;
  company: {
    name: string | null;
    catchPhrase: string | null;
    bs: string | null;
  } | null;
}