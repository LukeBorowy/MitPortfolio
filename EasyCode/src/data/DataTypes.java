package data;

public enum DataTypes {
	
    NUMBER,
    KEYPRESS,
    TEXT,
    DIRECTION,
    POSITION,
    SPRITE,
    BOOLEAN,
    COLOR,
    NONE;
	
	public static boolean canConvert(String text,DataTypes toType) {
		Text asText=new Text(text);
		try {
			if(toType==NUMBER) {
				
				asText.toNumber();
			}else if(toType==TEXT) {
				
				asText.toText();
			}else if(toType==DIRECTION) {
				
				asText.toDirection();
			}else if(toType==SPRITE) {
				
				//asText.toSprite();
				if(Sprite.canTextBeSprite(asText.text)) {
					return true;
				}
			}else if(toType==COLOR) {
				
				asText.toColor();
			}else {
				throw new DataConversionException("Cannot convert to this type.");
			}
		}catch(DataConversionException e){
			return false;
		}
		return true;
	}
	/**
	 * Check the likelihood of conversion being possible, on a scale of 0-10
	 * @param from The datatype that it is
	 * @param to The datatype it is converting to
	 * @return an {@code int} from 0 to 10, depending on how possible/probable a successful conversion is
	 */
	public static int getConvertPossibilty(DataTypes from,DataTypes to) {
		if(from==to) {
			return 10;//if to and from are the same, of course it can "convert"
		}
		if(to==TEXT) {//anything can convert to Text
			return 9;
		}
		if(from==TEXT) {
			if(to==NUMBER) {
				return 6;
			}else if(to==COLOR) {
				return 5;
			}else if(to==DIRECTION) {
				return 5;
			}else if(to==SPRITE) {
				return 2;
			}
		}else if(from==SPRITE) {
			return 0;//sprites can't really convert to anything else
		}
		return 0;//if not found above, assume it cannot be converted
	}
    
}
