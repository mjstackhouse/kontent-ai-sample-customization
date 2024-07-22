import React from 'react';
import { spinnerService } from '@simply007org/react-spinners';
import { useEffect, useState } from 'react';
import { useClient } from '../Client';
import { createCafeModel } from '../Utilities/CafeListing';
import {
  defaultLanguage,
  ILanguageObjectWithArray,
  initLanguageCodeObjectWithArray,
} from '../Utilities/LanguageCodes';
import { useIntl } from 'react-intl';
import { Cafe } from '../Models/content-types/cafe';
import { contentTypes } from '../Models/project/contentTypes';

const Cafes: React.FC = () => {
  const { formatMessage, locale: language } = useIntl();
  const [cafes, setCafes] = useState<ILanguageObjectWithArray<Cafe>>(
    initLanguageCodeObjectWithArray()
  );
  const [Client] = useClient();

  useEffect(() => {
    spinnerService.show('apiSpinner');

    const query = Client.items()
      .type(contentTypes.cafe.codename)
      .orderByDescending('system.name');

    if (language) {
      query.languageParameter(language);
    }

    query.toPromise().then((response) => {
      const currentLanguage = language || defaultLanguage;

      spinnerService.hide('apiSpinner');
      setCafes((data) => ({
        ...data,
        [currentLanguage]: response.data.items as Cafe[],
      }));
    });
  }, [language, Client]);

  if (cafes[language].length === 0) {
    return <div className="container" />;
  }

  const companyCafes = cafes[language];

  const companyCafeComponents = companyCafes.map((cafe: Cafe) => {
    const model = createCafeModel(cafe);

    return (
      <div className="col-md-6" key={cafe.system.codename}>
        <div
          className="cafe-image-tile js-scroll-to-map"
          data-address={model.dataAddress}
        >
          <div
            className="cafe-image-tile-image-wrapper"
            style={{
              backgroundImage: model.imageLink,
              backgroundSize: 'cover',
              backgroundPosition: 'right',
            }}
          />
          <div className="cafe-image-tile-content">
            <h3 className="cafe-image-tile-name">{model.name}</h3>
            <address className="cafe-tile-address">
              <span key={model.name} className="cafe-tile-address-anchor">
                {model.street}, {model.city}
                <br />
                {model.zipCode}, {model.countryWithState}
              </span>
            </address>
            <p>{model.phone}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <h2>{formatMessage({ id: 'Cafes.ourCafesTitle' })}</h2>
      <div className="row">{companyCafeComponents}</div>
    </div>
  );
};

export default Cafes;
