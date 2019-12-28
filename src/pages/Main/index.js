import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import { formatPrice } from '../../utils/format';

import * as CartActions from '../../store/modules/Cart/actions';

import {
  Container,
  ButtonAdd,
  Product,
  ProductImage,
  ProductTitle,
  ProductPrice,
  ProductButton,
  ProductAmount,
  ProductButtonTitle,
} from './styles';

class Main extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    const response = await api.get('/products');

    const data = response.data.map(product => ({
      ...product,
      priceFormated: formatPrice(product.price),
    }));

    this.setState({ products: data });
  };

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  renderProduct = ({ item }) => {
    const { amount } = this.props;

    return (
      <Product key={item.id}>
        <ProductImage source={{ uri: item.image }} />
        <ProductTitle>{item.title}</ProductTitle>
        <ProductPrice>{item.priceFormated}</ProductPrice>
        <ProductButton onPress={() => this.handleAddProduct(item.id)}>
          <ButtonAdd>
            <Icon name="add-shopping-cart" color="#FFF" size={20} />
            <ProductAmount>{amount[item.id] || 0}</ProductAmount>
            {console.tron.log(amount[item.id])}
          </ButtonAdd>
          <ProductButtonTitle>ADICIONAR</ProductButtonTitle>
        </ProductButton>
      </Product>
    );
  };

  render() {
    const { products } = this.state;
    return (
      <Container>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={products}
          extraData={this.props}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderProduct}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
