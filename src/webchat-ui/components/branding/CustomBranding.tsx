import React, { memo } from 'react';
import { styled } from '../../style';

const Link = styled.a(({ theme }) => ({
    alignItems: "flex-end",
    color: theme.greyWeakColor,
    display: "flex",
    fontSize: theme.unitSize * 1.375,
    justifyContent: "center",
    lineHeight: 1,
    marginTop: 'auto',
    padding: theme.unitSize * 2,
    paddingBottom: 0,
    textAlign: 'center',
    textDecoration: 'none',
	
	"&:focus":{		
		outline: "none",
		color: theme.primaryWeakColor,
		"#cognigyBrandingLogo": {
			"& path, & polygon": {
				fill: theme.primaryWeakColor,
			}			
		}		
	}
}));


const CustomBranding = (props: { branding: string, url: string;}) => (
    <Link href={props?.url} target="_blank" aria-label={props?.branding} id="cognigyBrandingLink">
        {props?.branding}
    </Link>
);

export default memo(CustomBranding, () => true);
