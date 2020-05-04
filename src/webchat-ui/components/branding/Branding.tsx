import React, { memo } from 'react';
import { styled } from '../../style';

const Link = styled.a(({ theme }) => ({
    color: theme.greyWeakColor,
    fontSize: theme.unitSize * 1.75,
    lineHeight: 1,
    marginTop: 'auto',
    padding: theme.unitSize,
    paddingBottom: theme.unitSize * 0.5,
    textAlign: 'center',
    textDecoration: 'none',
}));

const URL = 'https://cognigy.com/powered';

const ref = `?ref=${encodeURIComponent(window.location.href)}`;

const Branding = () => <Link href={URL + ref}>Powered by Cognigy</Link>;

export default memo(Branding, () => true);
